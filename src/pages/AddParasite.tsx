import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parasitesApi } from '../api/parasites';
import { useAuth } from '../contexts/AuthContext';

const AddParasite: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // ????? ???????? ?????
    const data: any = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      location: formData.get('location'),
      host: formData.get('host'),
      stage: formData.get('stage'),
      uploaded_by: user?.id
    };

    // ??????? ?? ??????
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
      data.image = imageFile;
    }

    try {
      await parasitesApi.create(data);
      navigate('/archive');
    } catch (err) {
      console.error(err);
      setError('??? ?? ????? ??????. ???? ???????? ??? ????.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">????? ???? ?????</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">????? ??????</label>
          <input name="name" required className="w-full border p-2 rounded" placeholder="????: Plasmodium falciparum" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">???????</label>
            <select name="category" className="w-full border p-2 rounded">
              <option value="Protozoa">?????? (Protozoa)</option>
              <option value="Helminths">???? (Helminths)</option>
              <option value="Arthropods">??????? (Arthropods)</option>
              <option value="Fungi">?????? (Fungi)</option>
              <option value="Other">????</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">???????</label>
            <select name="stage" className="w-full border p-2 rounded">
              <option value="Adult">Adult</option>
              <option value="Larva">Larva</option>
              <option value="Egg">Egg</option>
              <option value="Cyst">Cyst</option>
              <option value="Trophozoite">Trophozoite</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">?????</label>
          <textarea name="description" rows={3} className="w-full border p-2 rounded"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">??????</label>
          <input type="file" name="image" accept="image/*" className="w-full border p-2 rounded" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-white p-3 rounded hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? '???? ?????...' : '??? ??????'}
        </button>
      </form>
    </div>
  );
};

export default AddParasite;
