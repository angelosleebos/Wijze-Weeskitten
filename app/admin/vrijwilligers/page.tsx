'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authenticatedFetch } from '@/lib/api-client';
import VolunteerModal from '@/components/VolunteerModal';

interface Volunteer {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  image_url: string;
}

export default function VolunteersAdmin() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | undefined>(undefined);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await fetch('/api/volunteers');
      const data = await res.json();
      setVolunteers(data.volunteers || []);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze vrijwilliger wilt verwijderen?')) return;

    try {
      const res = await authenticatedFetch(`/api/volunteers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchVolunteers();
      }
    } catch (error) {
      console.error('Error deleting volunteer:', error);
    }
  };

  const handleEdit = (volunteer: Volunteer) => {
    setEditingVolunteer(volunteer);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingVolunteer(undefined);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingVolunteer(undefined);
  };

  const handleSave = () => {
    fetchVolunteers();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">group</span>
              Vrijwilligers Beheren
            </h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Alle Vrijwilligers</h2>
            <button 
              onClick={handleAdd}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Nieuwe Vrijwilliger
            </button>
          </div>

          {loading ? (
            <p>Laden...</p>
          ) : volunteers.length === 0 ? (
            <p className="text-gray-500">Nog geen vrijwilligers toegevoegd.</p>
          ) : (
            <div className="space-y-4">
              {volunteers.map((volunteer) => (
                <div key={volunteer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{volunteer.name}</h3>
                      <p className="text-primary-600">{volunteer.role}</p>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">mail</span>
                          {volunteer.email}
                        </p>
                        {volunteer.phone && (
                          <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">phone</span>
                            {volunteer.phone}
                          </p>
                        )}
                      </div>
                      {volunteer.bio && (
                        <p className="mt-2 text-gray-700">{volunteer.bio}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(volunteer)}
                        className="text-blue-600 hover:text-blue-700 p-2"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(volunteer.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <VolunteerModal
          volunteer={editingVolunteer}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
