import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, updateUserStatus } from '@/api';
import type { PaginationParams, User, UsersApiResponse } from '@/types';

// --------------------
// Query Keys
// --------------------
export const userQueryKeys = {
  all: ['users'] as const,
  list: (params: PaginationParams) => ['users', 'list', params] as const,
};

// --------------------
// Fetch Users Hook
// (React Query v5 compatible)
// --------------------
export const useUsers = (params: PaginationParams) => {
  return useQuery<UsersApiResponse>({
    queryKey: userQueryKeys.list(params),
    queryFn: () => fetchUsers(params),

    // ✅ v5 replacement for keepPreviousData
    placeholderData: (previousData) => previousData,
  });
};

// --------------------
// Update User Status (Optimistic UI)
// --------------------
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; data: User; message: string },
    Error,
    { userId: string; status: 'active' | 'inactive' },
    { previousData?: unknown }
  >({
    mutationFn: ({ userId, status }) =>
      updateUserStatus(userId, status),

    /**
     * ✅ Optimistic Update
     */
    onMutate: async ({ userId, status }) => {
      await queryClient.cancelQueries({ queryKey: userQueryKeys.all });

      const previousData = queryClient.getQueryData({
        queryKey: userQueryKeys.all,
      });

      queryClient.setQueriesData(
        { queryKey: userQueryKeys.all },
        (old: any) => {
          if (!old?.data?.users) return old;

          return {
            ...old,
            data: {
              ...old.data,
              users: old.data.users.map((u: User) =>
                u.userId === userId ? { ...u, status } : u
              ),
            },
          };
        }
      );

      return { previousData };
    },

    /**
     * ✅ Rollback on Error
     */
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          { queryKey: userQueryKeys.all },
          context.previousData
        );
      }
    },

    /**
     * ✅ Revalidate after mutation
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
};

// --------------------
// Manual Cache Invalidation
// --------------------
export const useInvalidateUsersCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
  };
};
