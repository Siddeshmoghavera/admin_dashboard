import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, updateUserStatus } from '@/api';
import type { PaginationParams } from '@/types';

// Query keys
export const userQueryKeys = {
  all: ['users'] as const,
  list: (params: PaginationParams) => ['users', 'list', params] as const,
};

/**
 * Hook to fetch users with pagination and filters
 */
export const useUsers = (params: PaginationParams) => {
  return useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => fetchUsers(params),
    keepPreviousData: true,
  });
};

/**
 * Hook to update user status with Optimistic UI
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: 'active' | 'inactive';
    }) => updateUserStatus(userId, status),

    /**
     * ✅ STEP 6.1 — Optimistic Update
     */
    onMutate: async ({ userId, status }) => {
      await queryClient.cancelQueries({ queryKey: userQueryKeys.all });

      const previousData = queryClient.getQueryData(userQueryKeys.all);

      queryClient.setQueriesData(userQueryKeys.all, (old: any) => {
        if (!old?.data?.users) return old;

        return {
          ...old,
          data: {
            ...old.data,
            users: old.data.users.map((u: any) =>
              u.userId === userId ? { ...u, status } : u
            ),
          },
        };
      });

      return { previousData };
    },

    /**
     * ✅ STEP 6.2 — Rollback on Error
     */
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(userQueryKeys.all, context.previousData);
      }
    },

    /**
     * Optional: Revalidate after mutation settles
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
};

/**
 * Hook to manually invalidate users cache
 */
export const useInvalidateUsersCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
  };
};
