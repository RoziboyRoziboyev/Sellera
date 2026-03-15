'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveFunnel(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase.from('products').insert({
        user_id: user.id,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        pixel_fb_id: formData.get('pixel_fb_id') as string,
        pixel_tt_id: formData.get('pixel_tt_id') as string,
        image_url: formData.get('image_url') as string,
        slug: formData.get('slug') as string,
    })

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/funnels')
    return { success: true }
}
