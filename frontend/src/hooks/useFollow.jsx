import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast'

const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: follow, iPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: "POST",
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Something went wrong");
                }
                
            } catch (error) {
                throw new Error(error.message);

            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestUsers"] }),
                queryClient.invalidateQueries({ queryKey: ["authUser"] })
            ])

        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    return { follow, iPending}
}

export default useFollow;