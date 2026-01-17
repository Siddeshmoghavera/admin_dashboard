import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, updateUserStatus } from '@/api';
import type { PaginationParams, User, UsersApiResponse } from '@/types';

export const userQueryKeys = {
  all: ['users'] as const,
  list: (params: PaginationParams) => ['users', 'list', params] as const,
};

/**
 * Fetch users
 */
export const useUsers = (params: PaginationParams) => {
  return useQuery<UsersApiResponse>({
    queryKey: userQueryKeys.list(params),
    queryFn: () => fetchUsers(params),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Update user status with Optimistic UI (React Query v5 SAFE)
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; data: User; message: string },
    Error,
    { userId: string; status: 'active' | 'inactive' },
    { previousQueries?: [unknown, UsersApiResponse | undefined][] }
  >({
    mutationFn: ({ userId, status }) =>
      updateUserStatus(userId, status),

    onMutate: async ({ userId, status }) => {
      // Cancel all users queries
      await queryClient.cancelQueries({
        queryKey: userQueryKeys.all,
      });

      // Get ALL matching queries safely (v5 way)
      const previousQueries =
        queryClient.getQueriesData<UsersApiResponse>({
          queryKey: userQueryKeys.all,
        });

      // Optimistically update each users list
      previousQueries.forEach(([queryKey, data]) => {
        if (!data?.data?.users) return;

        queryClient.setQueryData<UsersApiResponse>(queryKey, {
          ...data,
          data: {
            ...data.data,
            users: data.data.users.map((u) =>
              u.userId === userId ? { ...u, status } : u
            ),
          },
        });
      });

      return { previousQueries };
    },

    onError: (_error, _vars, context) => {
      // Rollback all affected queries
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.all,
      });
    },
  });
};

/**
 * Manual cache invalidation
 */
export const useInvalidateUsersCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.all,
      }),
  };
};
