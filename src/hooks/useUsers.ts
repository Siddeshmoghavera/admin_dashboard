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
 * Update user status with Optimistic UI
 */
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
     * Optimistic update
     */
    onMutate: async ({ userId, status }) => {
      // ✅ v5 requires filter object here
      await queryClient.cancelQueries({
        queryKey: userQueryKeys.all,
      });

      // ✅ raw key allowed here
      const previousData = queryClient.getQueryData(
        userQueryKeys.all
      );

      queryClient.setQueriesData(
        userQueryKeys.all,
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
     * Rollback on error
     */
    onError: (_error, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          userQueryKeys.all,
          context.previousData
        );
      }
    },

    /**
     * Revalidate
     */
    onSettled: () => {
      // ✅ v5 requires filter object here
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
