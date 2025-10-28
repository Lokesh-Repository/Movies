import { type Entry } from '../lib/api';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, memo, useMemo, useCallback } from 'react';

interface EntryTableProps {
  entries: Entry[];
  onEdit?: (entry: Entry) => void;
  onDelete?: (entry: Entry) => void;
  isLoading?: boolean;
}

interface MobileEntryCardProps {
  entry: Entry;
  onEdit?: (entry: Entry) => void;
  onDelete?: (entry: Entry) => void;
}

const MobileEntryCard = memo(({ entry, onEdit, onDelete }: MobileEntryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatType = useCallback((type: Entry['type']) => {
    return type === 'MOVIE' ? 'Movie' : 'TV Show';
  }, []);

  const handleEdit = useCallback(() => {
    onEdit?.(entry);
  }, [onEdit, entry]);

  const handleDelete = useCallback(() => {
    onDelete?.(entry);
  }, [onDelete, entry]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden smooth-transition">
      {/* Card Header - Always Visible */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2" title={entry.title}>
              {entry.title}
            </h3>
            <div className="flex items-center space-x-3">
              <Badge 
                variant={entry.type === 'MOVIE' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {formatType(entry.type)}
              </Badge>
              <span className="text-sm font-medium text-gray-600">{entry.year}</span>
            </div>
          </div>
          
          {/* Action Buttons - Touch Friendly */}
          <div className="flex flex-col space-y-2 ml-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                aria-label={`Edit ${entry.title}`}
                className="h-10 w-10 p-0 touch-manipulation button-smooth"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                aria-label={`Delete ${entry.title}`}
                className="h-10 w-10 p-0 touch-manipulation button-smooth hover:bg-red-50 hover:border-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Essential Info - Always Visible */}
        <div className="text-sm text-gray-600 mb-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Director:</span>
            <span className="text-right truncate ml-2 max-w-[60%]" title={entry.director}>
              {entry.director}
            </span>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-center py-2 text-sm text-gray-500 hover:text-gray-700 border-t border-gray-100 -mx-4 px-4 touch-manipulation"
          aria-label={isExpanded ? 'Show less details' : 'Show more details'}
        >
          <span className="mr-2">
            {isExpanded ? 'Show Less' : 'Show More'}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <div className="space-y-3 pt-3">
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700 text-sm">Budget:</span>
              <span className="text-sm text-gray-600 text-right ml-2 break-words max-w-[60%]" title={entry.budget}>
                {entry.budget}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700 text-sm">Location:</span>
              <span className="text-sm text-gray-600 text-right ml-2 break-words max-w-[60%]" title={entry.location}>
                {entry.location}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-700 text-sm">Duration:</span>
              <span className="text-sm text-gray-600 text-right ml-2 break-words max-w-[60%]" title={entry.duration}>
                {entry.duration}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const EntryTable = memo(({ entries, onEdit, onDelete, isLoading = false }: EntryTableProps) => {
  const formatType = useCallback((type: Entry['type']) => {
    return type === 'MOVIE' ? 'Movie' : 'TV Show';
  }, []);

  // Memoize expensive computations
  const { desktopEntries, mobileEntries } = useMemo(() => {
    return {
      desktopEntries: entries,
      mobileEntries: entries
    };
  }, [entries]);

  if (isLoading && entries.length === 0) {
    return (
      <div className="w-full">
        {/* Desktop Loading Skeleton */}
        <div className="hidden lg:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Director</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Tablet Loading Skeleton */}
        <div className="hidden md:block lg:hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Director</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Loading Skeleton */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-4">
                  <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="flex items-center space-x-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="w-full">
        {/* Desktop Empty State */}
        <div className="hidden lg:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Director</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="text-lg font-medium">No entries found</p>
                    <p className="text-sm">Add your first movie or TV show to get started!</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Tablet Empty State */}
        <div className="hidden md:block lg:hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Director</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="text-lg font-medium">No entries found</p>
                    <p className="text-sm">Add your first movie or TV show to get started!</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Mobile Empty State */}
        <div className="md:hidden">
          <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries found</h3>
            <p className="text-gray-500 text-sm">Add your first movie or TV show to get started!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop/Tablet Table View */}
      <div className="hidden lg:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {desktopEntries.map((entry) => (
              <EntryTableRow 
                key={entry.id} 
                entry={entry} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                formatType={formatType}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Tablet Compact Table View */}
      <div className="hidden md:block lg:hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="max-w-[180px] truncate" title={entry.title}>
                    {entry.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {entry.budget} • {entry.duration}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={entry.type === 'MOVIE' ? 'default' : 'secondary'}>
                    {formatType(entry.type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-[120px] truncate" title={entry.director}>
                    {entry.director}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate" title={entry.location}>
                    {entry.location}
                  </div>
                </TableCell>
                <TableCell>{entry.year}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(entry)}
                        aria-label={`Edit ${entry.title}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(entry)}
                        aria-label={`Delete ${entry.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {mobileEntries.map((entry, index) => (
          <div key={entry.id} className="animate-fade-in card-hover" style={{ animationDelay: `${index * 0.1}s` }}>
            <MobileEntryCard
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

// Optimized table row component
const EntryTableRow = memo(({ 
  entry, 
  onEdit, 
  onDelete, 
  formatType 
}: { 
  entry: Entry; 
  onEdit?: (entry: Entry) => void; 
  onDelete?: (entry: Entry) => void;
  formatType: (type: Entry['type']) => string;
}) => {
  const handleEdit = useCallback(() => {
    onEdit?.(entry);
  }, [onEdit, entry]);

  const handleDelete = useCallback(() => {
    onDelete?.(entry);
  }, [onDelete, entry]);

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium">
        <div className="max-w-[200px] truncate" title={entry.title}>
          {entry.title}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={entry.type === 'MOVIE' ? 'default' : 'secondary'}>
          {formatType(entry.type)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="max-w-[150px] truncate" title={entry.director}>
          {entry.director}
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-[120px] truncate" title={entry.budget}>
          {entry.budget}
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-[120px] truncate" title={entry.location}>
          {entry.location}
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-[100px] truncate" title={entry.duration}>
          {entry.duration}
        </div>
      </TableCell>
      <TableCell>{entry.year}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              aria-label={`Edit ${entry.title}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              aria-label={`Delete ${entry.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});