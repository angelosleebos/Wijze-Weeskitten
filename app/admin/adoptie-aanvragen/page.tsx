'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authenticatedFetch } from '@/lib/api-client';

interface AdoptionRequest {
  id: number;
  cat_id: number;
  cat_name: string;
  cat_image: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  motivation: string;
  created_at: string;
  has_garden: boolean;
  has_other_pets: boolean;
  has_children: boolean;
}

export default function AdoptionRequestsAdmin() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/adoption-requests' 
        : `/api/adoption-requests?status=${filter}`;
      const res = await authenticatedFetch(url);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string, adminNotes?: string) => {
    try {
      const res = await authenticatedFetch(`/api/adoption-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, admin_notes: adminNotes }),
      });

      if (res.ok) {
        fetchRequests();
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze aanvraag wilt verwijderen?')) return;

    try {
      const res = await authenticatedFetch(`/api/adoption-requests/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'In behandeling';
      case 'approved': return 'Goedgekeurd';
      case 'rejected': return 'Afgewezen';
      case 'completed': return 'Voltooid';
      default: return status;
    }
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
              <span className="material-symbols-outlined">favorite</span>
              Adoptie Aanvragen
            </h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['all', 'pending', 'approved', 'rejected', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === status
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Alle' : getStatusLabel(status)}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Laden...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500">Geen aanvragen gevonden.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex gap-4">
                    <img 
                      src={request.cat_image} 
                      alt={request.cat_name} 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{request.name}</h3>
                          <p className="text-sm text-gray-600">
                            Wil adopteren: <span className="font-medium">{request.cat_name}</span>
                          </p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">mail</span>
                          {request.email}
                        </span>
                        {request.phone && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">phone</span>
                            {request.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">calendar_today</span>
                          {new Date(request.created_at).toLocaleDateString('nl-NL')}
                        </span>
                      </div>

                      <div className="flex gap-2 text-xs text-gray-500 mb-3">
                        {request.has_garden && (
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                            🌱 Tuin
                          </span>
                        )}
                        {request.has_other_pets && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            🐾 Andere huisdieren
                          </span>
                        )}
                        {request.has_children && (
                          <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                            👶 Kinderen
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                        <strong>Motivatie:</strong> {request.motivation}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          Details
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(request.id, 'approved')}
                              className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              Goedkeuren
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request.id, 'rejected')}
                              className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              Afwijzen
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Verwijder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Aanvraag Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Cat Info */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <img 
                  src={selectedRequest.cat_image} 
                  alt={selectedRequest.cat_name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedRequest.cat_name}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full inline-block mt-1 ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusLabel(selectedRequest.status)}
                  </span>
                </div>
              </div>

              {/* All details would go here - truncated for brevity */}
              <div>
                <h4 className="font-bold mb-2">Aanvrager</h4>
                <p><strong>Naam:</strong> {selectedRequest.name}</p>
                <p><strong>Email:</strong> {selectedRequest.email}</p>
                <p><strong>Telefoon:</strong> {selectedRequest.phone || 'Niet opgegeven'}</p>
              </div>

              <div>
                <h4 className="font-bold mb-2">Motivatie</h4>
                <p className="text-gray-700">{selectedRequest.motivation}</p>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'approved')}
                    className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Goedkeuren
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Afwijzen
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
