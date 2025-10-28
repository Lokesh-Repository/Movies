import { Edit, Trash2, Search, Filter, X } from "lucide-react";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useInfiniteEntries } from "../hooks/useEntries";
import { useBreakpoint } from "../hooks/useResponsive";
import { type Entry } from "../lib/api";

interface SimpleEntryTableProps {
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
}

export function SimpleEntryTable({ onEdit, onDelete }: SimpleEntryTableProps) {
  const { isMobile, isSmallMobile, containerPadding, fontSize } = useBreakpoint();
  const {
    data: entriesData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteEntries(10); 
  
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "MOVIE" | "TV_SHOW">("ALL");
  const [yearFilter, setYearFilter] = useState("");
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const allEntries = useMemo(() => {
    return entriesData?.pages.flatMap(page => page.data) ?? [];
  }, [entriesData?.pages]);
  
  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const matchesSearch = searchTerm === "" || 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "ALL" || entry.type === typeFilter;
      
      const matchesYear = yearFilter === "" || entry.year.toString().includes(yearFilter);
      
      return matchesSearch && matchesType && matchesYear;
    });
  }, [allEntries, searchTerm, typeFilter, yearFilter]);
  
  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("ALL");
    setYearFilter("");
  };
  
  const hasActiveFilters = searchTerm !== "" || typeFilter !== "ALL" || yearFilter !== "";
  
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage && !hasActiveFilters) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, hasActiveFilters]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver]);

  if (isLoading) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 0',
            textAlign: 'center'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid #f3f4f6',
              borderTop: '2px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{
              marginTop: '16px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Loading your entries...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#dc2626',
              margin: '0 0 8px 0'
            }}>
              Error Loading Entries
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              There was a problem loading your movie and TV show entries.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 16px',
                backgroundColor: '#667eea',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a67d8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (allEntries.length === 0) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎬</div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 8px 0'
            }}>
              No Entries Yet
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Start building your collection by adding your first movie or TV show!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      overflow: 'hidden'
    }}>
      <div style={{ padding: containerPadding }}>
        <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'stretch' : 'flex-start', 
            marginBottom: '20px',
            gap: isMobile ? '12px' : '0'
          }}>
            <div>
              <h3 style={{ 
                fontSize: fontSize.lg, 
                fontWeight: '600', 
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                Your Collection
              </h3>
              <p style={{ 
                fontSize: fontSize.sm, 
                color: '#6b7280',
                margin: '0'
              }}>
                {hasActiveFilters 
                  ? `${filteredEntries.length} of ${allEntries.length} entries (filtered)`
                  : hasNextPage 
                    ? `${allEntries.length} entries loaded${isFetchingNextPage ? ', loading more...' : ''}`
                    : `${allEntries.length} entries total`
                }
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: isMobile ? '8px 12px' : '6px 12px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: isMobile ? '13px' : '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  alignSelf: isMobile ? 'flex-start' : 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <X size={14} />
                Clear Filters
              </button>
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: '12px', 
            marginBottom: '20px',
            alignItems: isMobile ? 'stretch' : 'center'
          }}>
            <div style={{ 
              position: 'relative', 
              minWidth: isMobile ? 'auto' : '250px', 
              flex: isMobile ? 'none' : '1',
              width: isMobile ? '100%' : 'auto'
            }}>
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }}
              />
              <input
                type="text"
                placeholder={isMobile ? "Search..." : "Search by title, director, or location..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: isMobile ? '12px 12px 12px 36px' : '8px 12px 8px 36px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              flexDirection: isSmallMobile ? 'column' : 'row',
              width: isMobile ? '100%' : 'auto'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                flex: isSmallMobile ? '1' : 'none'
              }}>
                <Filter size={16} style={{ color: '#6b7280' }} />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as "ALL" | "MOVIE" | "TV_SHOW")}
                  style={{
                    padding: isMobile ? '12px' : '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    outline: 'none',
                    flex: isSmallMobile ? '1' : 'none',
                    minWidth: isSmallMobile ? '0' : 'auto'
                  }}
                >
                  <option value="ALL">All Types</option>
                  <option value="MOVIE">🎬 Movies</option>
                  <option value="TV_SHOW">📺 TV Shows</option>
                </select>
              </div>
              
              <input
                type="text"
                placeholder="Filter by year..."
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                style={{
                  padding: isMobile ? '12px' : '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px', 
                  width: isSmallMobile ? '100%' : isMobile ? '120px' : '140px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>
          
          {hasActiveFilters && (
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              flexWrap: 'wrap',
              marginBottom: '16px'
            }}>
              {searchTerm && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#eff6ff',
                  color: '#1e40af',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Search: "{searchTerm}"
                </span>
              )}
              {typeFilter !== "ALL" && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#f0fdf4',
                  color: '#166534',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Type: {typeFilter === "MOVIE" ? "🎬 Movies" : "📺 TV Shows"}
                </span>
              )}
              {yearFilter && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Year: {yearFilter}
                </span>
              )}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                ℹ️ Infinite scroll disabled while filtering
              </span>
            </div>
          )}
        </div>
        
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredEntries.length === 0 ? (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center',
                color: '#6b7280',
                fontStyle: 'italic',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                {hasActiveFilters ? 'No entries match your filters' : 'No entries found'}
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div key={entry.id} style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                    gap: '12px'
                  }}>
                    <h4 style={{ 
                      fontWeight: '600', 
                      color: '#111827',
                      margin: '0',
                      fontSize: '16px',
                      lineHeight: '1.4',
                      flex: '1'
                    }}>
                      {entry.title}
                    </h4>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: entry.type === "MOVIE" ? '#dbeafe' : '#dcfce7',
                      color: entry.type === "MOVIE" ? '#1e40af' : '#166534',
                      whiteSpace: 'nowrap',
                      flexShrink: '0'
                    }}>
                      {entry.type === "MOVIE" ? "🎬" : "📺"}
                      {entry.type === "MOVIE" ? "Movie" : "TV Show"}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px 16px',
                    marginBottom: '16px',
                    fontSize: '14px'
                  }}>
                    <div>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Director:</span>
                      <div style={{ color: '#111827', marginTop: '2px' }}>{entry.director}</div>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Year:</span>
                      <div style={{ color: '#111827', marginTop: '2px' }}>{entry.year}</div>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Budget:</span>
                      <div style={{ color: '#111827', marginTop: '2px' }}>{entry.budget}</div>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Duration:</span>
                      <div style={{ color: '#111827', marginTop: '2px' }}>{entry.duration}</div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Location:</span>
                    <div style={{ color: '#111827', marginTop: '2px' }}>{entry.location}</div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <button
                      onClick={() => onEdit(entry)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        flex: '1',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.borderColor = '#9ca3af';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(entry)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        flex: '1',
                        padding: '10px',
                        border: '1px solid #fca5a5',
                        borderRadius: '6px',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                        e.currentTarget.style.borderColor = '#f87171';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                        e.currentTarget.style.borderColor = '#fca5a5';
                      }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Desktop Table Layout */
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: '#6b7280',
                    minWidth: '200px'
                  }}>Title</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: '#6b7280',
                    width: '120px'
                  }}>Type</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: '#6b7280'
                  }}>Director</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: '#6b7280',
                    width: '80px'
                  }}>Year</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: '#6b7280'
                  }}>Budget</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: '#6b7280'
                  }}>Duration</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: '#6b7280'
                  }}>Location</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: '#6b7280',
                    width: '120px'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ 
                      padding: '40px', 
                      textAlign: 'center',
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      {hasActiveFilters ? 'No entries match your filters' : 'No entries found'}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                  <tr key={entry.id} style={{
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: '500', color: '#111827' }}>
                        {entry.title}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      verticalAlign: 'middle',
                      width: '120px'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '6px 10px',
                        borderRadius: '16px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: entry.type === "MOVIE" ? '#dbeafe' : '#dcfce7',
                        color: entry.type === "MOVIE" ? '#1e40af' : '#166534',
                        whiteSpace: 'nowrap',
                        minWidth: '90px'
                      }}>
                        {entry.type === "MOVIE" ? "🎬" : "📺"}
                        {entry.type === "MOVIE" ? "Movie" : "TV Show"}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      verticalAlign: 'middle',
                      color: '#6b7280'
                    }}>
                      {entry.director}
                    </td>
                    <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                      {entry.year}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      verticalAlign: 'middle',
                      color: '#6b7280'
                    }}>
                      {entry.budget}
                    </td>
                    <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                      {entry.duration}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      verticalAlign: 'middle',
                      color: '#6b7280'
                    }}>
                      {entry.location}
                    </td>
                    <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => onEdit(entry)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            padding: '0',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            color: '#6b7280',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.color = '#374151';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(entry)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            padding: '0',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            color: '#dc2626',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fef2f2';
                            e.currentTarget.style.color = '#b91c1c';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#dc2626';
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div ref={loadMoreRef} style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '16px 0',
          minHeight: '60px'
        }}>
          {isFetchingNextPage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #f3f4f6',
                borderTop: '2px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Loading more entries...
            </div>
          )}
          
          {!hasNextPage && allEntries.length > 0 && !hasActiveFilters && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <div style={{ height: '1px', backgroundColor: '#d1d5db', width: '64px' }}></div>
              <span>You've reached the end</span>
              <div style={{ height: '1px', backgroundColor: '#d1d5db', width: '64px' }}></div>
            </div>
          )}

          {hasNextPage && !isFetchingNextPage && allEntries.length > 0 && !hasActiveFilters && (
            <button
              onClick={() => fetchNextPage()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
