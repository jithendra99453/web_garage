import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Trophy, Medal, Award, Crown, Filter, Search, 
  Users, School, Target, Zap, ChevronDown 
} from 'lucide-react';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
  // State for data from the backend
  const [allStudents, setAllStudents] = useState([]);
  const [uniqueSchools, setUniqueSchools] = useState([]);
  
  // State for managing user-selected filters
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch initial data (all students and unique schools for filters)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch all student data for the leaderboard in one go
        const studentsPromise = axios.get('http://localhost:5000/api/leaderboard');
        // Fetch the list of schools for the filter dropdown
        const schoolsPromise = axios.get('http://localhost:5000/api/schools');

        // Wait for both API calls to complete
        const [studentsRes, schoolsRes] = await Promise.all([studentsPromise, schoolsPromise]);
        
        setAllStudents(studentsRes.data);
        setUniqueSchools(schoolsRes.data);

      } catch (err) {
        console.error("Failed to fetch leaderboard data:", err);
        setError("Could not load the leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Filter and sort students based on state filters
  const filteredAndSortedStudents = useMemo(() => {
    return allStudents
      .filter(student => {
        const matchesSchool = selectedSchool === 'all' || student.school === selectedSchool;
        // The class filter is now a simple text search on the class name
        const matchesClass = selectedClass === 'all' || (student.class && student.class.toLowerCase().includes(selectedClass.toLowerCase()));
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSchool && matchesClass && matchesSearch;
      })
      // The backend already sorts, but we re-sort on the client in case of filtering
      .sort((a, b) => b.ecoPoints - a.ecoPoints);
  }, [allStudents, selectedSchool, selectedClass, searchTerm]);

  // --- Helper functions for rank icons and styling (no changes needed) ---
  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className={styles['rank-icon-gold']} size={24} />;
      case 2: return <Medal className={styles['rank-icon-silver']} size={24} />;
      case 3: return <Award className={styles['rank-icon-bronze']} size={24} />;
      default: return <span className={styles['rank-number']}>#{rank}</span>;
    }
  };
  
  const getRankClass = (rank) => {
    switch(rank) {
      case 1: return styles['rank-first'];
      case 2: return styles['rank-second'];
      case 3: return styles['rank-third'];
      default: return '';
    }
  };

  // --- Render Logic ---
  if (loading) {
    return <div className={styles['leaderboard-container']}><div className={styles['no-results']}>Loading Leaderboard...</div></div>;
  }
  if (error) {
    return <div className={styles['leaderboard-container']}><div className={styles['no-results']} style={{color: 'red'}}>{error}</div></div>;
  }

  return (
    <div className={styles['leaderboard-container']}>
      {/* Header Section */}
      <div className={styles['header-section']}>
        <div className={styles['header-content']}>
          <div className={styles['header-title-section']}>
            <Trophy className={styles['header-icon']} size={32} />
            <div>
              <h1 className={styles['header-title']}>Eco Leaderboard</h1>
              <p className={styles['header-subtitle']}>Top eco warriors making a difference</p>
            </div>
          </div>
          <div className={styles['stats-section']}>
            <div className={styles['stat-item']}>
              <Users size={20} />
              <span>{filteredAndSortedStudents.length} Students</span>
            </div>
            <div className={styles['stat-item']}>
              <Zap size={20} />
              <span>{filteredAndSortedStudents.reduce((sum, s) => sum + s.ecoPoints, 0).toLocaleString()} Total Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={styles['filters-section']}>
        <div className={styles['filters-container']}>
          <div className={styles['search-container']}>
            <Search className={styles['search-icon']} size={20} />
            <input type="text" placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles['search-input']} />
          </div>
          <div className={styles['filter-container']}>
            <School className={styles['filter-icon']} size={18} />
            <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} className={styles['filter-select']}>
              <option value="all">All Schools</option>
              {uniqueSchools.map(school => <option key={school} value={school}>{school}</option>)}
            </select>
            <ChevronDown className={styles['select-arrow']} size={16} />
          </div>
          <div className={styles['filter-container']}>
            <Target className={styles['filter-icon']} size={18} />
            <input type="text" placeholder="Filter by class..." value={selectedClass === 'all' ? '' : selectedClass} onChange={(e) => setSelectedClass(e.target.value || 'all')} className={styles['search-input']} />
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className={styles['leaderboard-section']}>
        {filteredAndSortedStudents.length === 0 ? (
          <div className={styles['no-results']}>
            <Trophy size={48} className={styles['no-results-icon']} />
            <h3>No students found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className={styles['leaderboard-list']}>
            {filteredAndSortedStudents.map((student, index) => {
              const rank = index + 1;
              return (
                <div key={student.id} className={`${styles['student-card']} ${getRankClass(rank)}`}>
                  <div className={styles['rank-section']}>{getRankIcon(rank)}</div>
                  <div className={styles['student-info']}>
                    <div className={styles['avatar']}>{student.avatar}</div>
                    <div className={styles['student-details']}>
                      <h3 className={styles['student-name']}>{student.name}</h3>
                      <div className={styles['student-meta']}>
                        <span className={styles['school-name']}><School size={14} />{student.school}</span>
                        <span className={styles['class-name']}><Target size={14} />Class {student.class}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles['points-section']}>
                    <div className={styles['points-value']}>{student.ecoPoints.toLocaleString()}</div>
                    <div className={styles['points-label']}><Zap size={14} />Eco Points</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
