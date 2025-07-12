export function makeAuthHeaders(
    token: string
  ): { Authorization: string; } {
    return {
      Authorization: `Bearer ${token}`,
    };
  }