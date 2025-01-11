import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { db, Workshop } from '../../lib/db';

export default function ManageWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isAddingWorkshop, setIsAddingWorkshop] = useState(false);
  const [newWorkshop, setNewWorkshop] = useState<Partial<Workshop>>({});

  useEffect(() => {
    loadWorkshops();
  }, []);

  async function loadWorkshops() {
    const allWorkshops = await db.workshops.toArray();
    setWorkshops(allWorkshops);
  }

  const handleAddWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newWorkshop.title && newWorkshop.date) {
      const workshop: Workshop = {
        id: Date.now().toString(),
        title: newWorkshop.title,
        description: newWorkshop.description || '',
        date: newWorkshop.date,
        time: newWorkshop.time || '09:00',
        location: newWorkshop.location || 'TBD',
        points: newWorkshop.points || 10,
        minLevel: newWorkshop.minLevel || 1,
      };

      await db.workshops.add(workshop);
      await loadWorkshops();
      setIsAddingWorkshop(false);
      setNewWorkshop({});
    }
  };

  const handleDeleteWorkshop = async (id: string) => {
    if (confirm('Are you sure you want to delete this workshop?')) {
      await db.workshops.delete(id);
      await loadWorkshops();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Workshops</h1>
        <button
          onClick={() => setIsAddingWorkshop(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Workshop
        </button>
      </div>

      {isAddingWorkshop && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Workshop</h2>
          <form onSubmit={handleAddWorkshop}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md"
                  value={newWorkshop.title || ''}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newWorkshop.description || ''}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded-md"
                  value={newWorkshop.date || ''}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  required
                  className="w-full p-2 border rounded-md"
                  value={newWorkshop.time || ''}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md"
                  value={newWorkshop.location || ''}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full p-2 border rounded-md"
                  value={newWorkshop.points || ''}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, points: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Level
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="5"
                  className="w-full p-2 border rounded-md"
                  value={newWorkshop.minLevel || ''}
                  onChange={(e) => setNewWorkshop({ ...newWorkshop, minLevel: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsAddingWorkshop(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add Workshop
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {workshops.map((workshop) => (
          <div key={workshop.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{workshop.title}</h2>
                <p className="mt-2 text-gray-600">{workshop.description}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{workshop.date} at {workshop.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDeleteWorkshop(workshop.id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}