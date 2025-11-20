'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Donation {
  id: number;
  donor_name?: string;
  donor_email?: string;
  amount: number;
  payment_status: string;
  mollie_payment_id?: string;
  created_at: string;
}

export default function DonationsAdmin() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, count: 0 });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();
      const donationsList = data.donations || [];
      setDonations(donationsList);
      
      const total = donationsList
        .filter((d: Donation) => d.payment_status === 'paid')
        .reduce((sum: number, d: Donation) => sum + parseFloat(d.amount.toString()), 0);
      
      setStats({
        total,
        count: donationsList.length
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return 'check_circle';
      case 'pending': return 'schedule';
      case 'failed': return 'cancel';
      default: return 'help';
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
              <span className="material-symbols-outlined">payments</span>
              Donaties
            </h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-500 text-4xl">payments</span>
              <div>
                <p className="text-gray-600 text-sm">Totaal Ontvangen</p>
                <p className="text-2xl font-bold">€{stats.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-500 text-4xl">receipt_long</span>
              <div>
                <p className="text-gray-600 text-sm">Aantal Donaties</p>
                <p className="text-2xl font-bold">{stats.count}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-500 text-4xl">trending_up</span>
              <div>
                <p className="text-gray-600 text-sm">Gemiddeld Bedrag</p>
                <p className="text-2xl font-bold">
                  €{stats.count > 0 ? (stats.total / stats.count).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Alle Donaties</h2>

          {loading ? (
            <p>Laden...</p>
          ) : donations.length === 0 ? (
            <p className="text-gray-500">Nog geen donaties ontvangen.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3">Datum</th>
                    <th className="text-left p-3">Naam</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-right p-3">Bedrag</th>
                    <th className="text-center p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-sm">
                        {new Date(donation.created_at).toLocaleDateString('nl-NL')}
                      </td>
                      <td className="p-3">{donation.donor_name || 'Anoniem'}</td>
                      <td className="p-3 text-sm text-gray-600">{donation.donor_email || '-'}</td>
                      <td className="p-3 text-right font-semibold">€{parseFloat(donation.amount.toString()).toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(donation.payment_status)}`}>
                          <span className="material-symbols-outlined text-xs">{getStatusIcon(donation.payment_status)}</span>
                          {donation.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
