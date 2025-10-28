import { useState } from 'react';
import { SimpleEntryTable } from './SimpleEntryTable';
import { SimpleEntryForm } from './SimpleEntryForm';
import { SimpleModal } from './SimpleModal';
import { Plus } from 'lucide-react';
import { useCreateEntry, useUpdateEntry, useDeleteEntry } from '../hooks/useEntries';
import { useBreakpoint } from '../hooks/useResponsive';
import { type Entry, type EntryFormData } from '../lib/api';

export function EntryManager() {
  const { isMobile, fontSize } = useBreakpoint();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const createEntryMutation = useCreateEntry();
  const updateEntryMutation = useUpdateEntry();
  const deleteEntryMutation = useDeleteEntry();

  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (data: EntryFormData) => {
    await createEntryMutation.mutateAsync(data);
    setIsCreateDialogOpen(false);
  };

  const handleCreateCancel = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (data: EntryFormData) => {
    if (!selectedEntry) return;
    
    await updateEntryMutation.mutateAsync({
      id: selectedEntry.id,
      data,
    });
    
    setIsEditDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleDeleteClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (entry: Entry) => {
    await deleteEntryMutation.mutateAsync(entry.id);
    setIsDeleteDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleDeleteCancel = (open: boolean) => {
    if (!open) {
      setIsDeleteDialogOpen(false);
      setSelectedEntry(null);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        marginBottom: isMobile ? '16px' : '20px',
        paddingBottom: '16px',
        borderBottom: '2px solid #f3f4f6',
        gap: isMobile ? '16px' : '0'
      }}>
        <div style={{ flex: isMobile ? 'none' : '1' }}>
          <h2 style={{
            fontSize: fontSize['3xl'],
            fontWeight: 'bold',
            color: 'black',
            WebkitBackgroundClip: 'text',
            margin: '0 0 8px 0'
          }}>
            🎬 Movies & TV Shows
          </h2>
          <p style={{
            color: '#6b7280',
            margin: '0',
            fontSize: fontSize.base
          }}>
            Manage your favorite entertainment collection
          </p>
        </div>
        <button 
          onClick={handleCreateClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: isMobile ? '14px 20px' : '12px 24px',
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: fontSize.base,
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(17, 153, 142, 0.4)',
            alignSelf: isMobile ? 'stretch' : 'flex-start'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(17, 153, 142, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(17, 153, 142, 0.4)';
          }}
        >
          <Plus size={20} />
          Add Entry
        </button>
      </div>

      <SimpleEntryTable
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <SimpleModal
        isOpen={isCreateDialogOpen}
        onClose={handleCreateCancel}
        title="Add New Entry"
      >
        <SimpleEntryForm
          onSubmit={handleCreateSubmit}
          onCancel={handleCreateCancel}
          isLoading={createEntryMutation.isPending}
        />
      </SimpleModal>

      <SimpleModal
        isOpen={isEditDialogOpen}
        onClose={handleEditCancel}
        title="Edit Entry"
      >
        {selectedEntry && (
          <SimpleEntryForm
            entry={selectedEntry}
            onSubmit={handleEditSubmit}
            onCancel={handleEditCancel}
            isLoading={updateEntryMutation.isPending}
          />
        )}
      </SimpleModal>

      <SimpleModal
        isOpen={isDeleteDialogOpen}
        onClose={() => handleDeleteCancel(false)}
        title="Delete Entry"
      >
        {selectedEntry && (
          <div>
            <p style={{ marginBottom: '20px' }}>
              Are you sure you want to delete "<strong>{selectedEntry.title}</strong>"?
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleDeleteCancel(false)}
                disabled={deleteEntryMutation.isPending}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(selectedEntry)}
                disabled={deleteEntryMutation.isPending}
                className="btn btn-danger"
              >
                {deleteEntryMutation.isPending ? '⏳ Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
}