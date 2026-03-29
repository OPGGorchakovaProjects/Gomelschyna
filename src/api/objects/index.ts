import { supabase } from '@api';
import { CreateObjectInput, UpdateObjectInput } from '@types';


export const objects = {
  async getAll() {
    const { data, error } = await supabase
      .from('objects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Object[];
  },

  async getByType(type: string) {
    const { data, error } = await supabase
      .from('objects')
      .select('*')
      .eq('category', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Object[];
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('objects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Object;
  },

  async create(input: CreateObjectInput) {
    const { data, error } = await supabase
      .from('objects')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data as Object;
  },

  async update(id: number, input: UpdateObjectInput) {
    const { data, error } = await supabase
      .from('objects')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Object;
  },

  async delete(id: number) {
    const { error } = await supabase.from('objects').delete().eq('id', id);
    if (error) throw error;
  },

  async syncFromJson(jsonData: any[]) {
    const results = [];
    const errors = [];

    for (const item of jsonData) {
      try {
        const input: CreateObjectInput = {
          created_by: 'admin',
          category: item.category,
          name: item.name,
          description: item.description,
          location: item.location,
          coordinates: item.coordinates || ['52.4242', '31.0143'],
          map_marker: item.coordinates ? item.coordinates.join(',') : '52.4242,31.0143',
          link: item.link || null,
          images: item.images || null
        };

        const result = await this.create(input);
        results.push(result);
      } catch (error) {
        console.error('Error syncing item:', item, error);
        errors.push({ item, error });
      }
    }

    return { results, errors };
  },

  uploadImage: async (file: File, type: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${type}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  deleteImage: async (url: string): Promise<void> => {
    // Извлекаем путь из URL
    const pathMatch = url.match(/images\/(.+)$/);
    if (!pathMatch) return;

    const path = pathMatch[1];
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);

    if (error) throw error;
  },

  // Функция для получения всех изображений объекта по типу
  getImagesByType: async (type: string): Promise<string[]> => {
    const { data, error } = await supabase.storage
      .from('images')
      .list(type);

    if (error) throw error;

    return data.map(file => {
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(`${type}/${file.name}`);
      return data.publicUrl;
    });
  }
}; 