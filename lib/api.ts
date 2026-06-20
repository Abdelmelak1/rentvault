const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('rv_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  access_token: string;
  user: { id: string; email: string; role: string };
}
export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  role: string;
  provider: string;
  createdAt: string;
}

export const auth = {
  register: (email: string, password: string, fullName?: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    }),
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<UserProfile>('/auth/me'),
  googleUrl: () => `${API}/auth/google`,
  githubUrl: () => `${API}/auth/github`,
};

// ── Categories ────────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  createdAt: string;
}
export const categories = {
  list: () => request<Category[]>('/categories'),
};

// ── Assets ────────────────────────────────────────────────────────────────────
export interface Asset {
  id: string;
  ownerId: string;
  categoryId: string | null;
  name: string;
  description: string;
  imageUrl: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  securityDeposit: string;
  condition: string;
  status: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  category?: { name: string; slug: string } | null;
}
export interface CreateAssetPayload {
  name: string;
  description?: string;
  categoryId?: string;
  imageUrl?: string;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  securityDeposit?: number;
  condition?: string;
  status?: string;
  location?: string;
  // Vehicle fields
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  images?: string[];
  // Real estate fields
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  amenities?: string[];
}
export const assets = {
  list: (params?: { status?: string; categorySlug?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<Asset[]>(`/assets${q ? `?${q}` : ''}`);
  },
  mine: (params?: { status?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<Asset[]>(`/assets/mine${q ? `?${q}` : ''}`);
  },
  get: (id: string) => request<Asset>(`/assets/${id}`),
  create: (payload: CreateAssetPayload) =>
    request<Asset>('/assets', { method: 'POST', body: JSON.stringify(payload) }),
  uploadImages: (files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append('images', f, f.name));
    const token = typeof window !== 'undefined' ? localStorage.getItem('rv_token') : null;
    return fetch(`${API}/assets/upload`, {
      method: 'POST',
      body: form,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'Upload failed');
      }
      return res.json();
    });
  },
  update: (id: string, payload: Partial<CreateAssetPayload>) =>
    request<Asset>(`/assets/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id: string) =>
    request<{ message: string }>(`/assets/${id}`, { method: 'DELETE' }),
};

// ── Rentals ───────────────────────────────────────────────────────────────────
export interface Rental {
  id: string;
  assetId: string;
  renterId: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  securityDeposit: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  asset?: { name: string; imageUrl: string; dailyRate: string; location?: string };
}
export const rentals = {
  list: () => request<Rental[]>('/rentals'),
  get: (id: string) => request<Rental>(`/rentals/${id}`),
  create: (payload: { assetId: string; startDate: string; endDate: string; notes?: string }) =>
    request<Rental>('/rentals', { method: 'POST', body: JSON.stringify(payload) }),
  updateStatus: (id: string, status: string) =>
    request<Rental>(`/rentals/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
