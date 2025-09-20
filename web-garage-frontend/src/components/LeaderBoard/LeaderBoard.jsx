import React, { useState, useMemo } from 'react';
import { 
  Trophy, Medal, Award, Crown, Filter, Search, 
  Users, School, Target, Zap, ChevronDown 
} from 'lucide-react';
import styles from './Leaderboard.module.css';

// Sample data - replace with your API call
const sampleStudents = [
  { id: 1, name: "Arjun Sharma", ecoPoints: 2850, school: "Green Valley High School", class: "10-A", avatar: "AS" },
  { id: 2, name: "Priya Patel", ecoPoints: 2720, school: "Eco International", class: "9-B", avatar: "PP" },
  { id: 3, name: "Rahul Kumar", ecoPoints: 2680, school: "Green Valley High School", class: "10-B", avatar: "RK" },
  { id: 4, name: "Sneha Reddy", ecoPoints: 2550, school: "Nature Academy", class: "11-A", avatar: "SR" },
  { id: 5, name: "Vikram Singh", ecoPoints: 2480, school: "Green Valley High School", class: "10-A", avatar: "VS" },
  { id: 6, name: "Ananya Gupta", ecoPoints: 2350, school: "Eco International", class: "9-A", avatar: "AG" },
  { id: 7, name: "Karthik Nair", ecoPoints: 2280, school: "Nature Academy", class: "11-B", avatar: "KN" },
  { id: 8, name: "Divya Joshi", ecoPoints: 2150, school: "Green Valley High School", class: "10-C", avatar: "DJ" },
  { id: 9, name: "Rohit Mehta", ecoPoints: 2080, school: "Eco International", class: "9-C", avatar: "RM" },
  { id: 10, name: "Kavya Iyer", ecoPoints: 1980, school: "Nature Academy", class: "11-A", avatar: "KI" },
  { id: 11, name: "Aditya Rao", ecoPoints: 1850, school: "Green Valley High School", class: "10-B", avatar: "AR" },
  { id: 12, name: "Ishita Shah", ecoPoints: 1750, school: "Eco International", class: "9-B", avatar: "IS" },
  { id: 13, name: "Nikhil Pandey", ecoPoints: 1680, school: "Nature Academy", class: "11-C", avatar: "NP" },
  { id: 14, name: "Riya Trivedi", ecoPoints: 1580, school: "Green Valley High School", class: "10-A", avatar: "RT" },
  { id: 15, name: "Harsh Agarwal", ecoPoints: 1450, school: "Eco International", class: "9-A", avatar: "HA" },
];

const Leaderboard = () => {
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract unique schools and classes for filter options
  const uniqueSchools = [...new Set(sampleStudents.map(student => student.school))];
  const uniqueClasses = [...new Set(sampleStudents.map(student => student.class))];
  
  // Filter and sort students based on selected filters
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = sampleStudents.filter(student => {
      const matchesSchool = selectedSchool === 'all' || student.school === selectedSchool;
      const matchesClass = selectedClass === 'all' || student.class === selectedClass;
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSchool && matchesClass && matchesSearch;
    });
    
    // Sort by eco points in descending order
    return filtered.sort((a, b) => b.ecoPoints - a.ecoPoints);
  }, [selectedSchool, selectedClass, searchTerm]);
  
  // Get rank icon based on position
  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <Crown className={styles['rank-icon-gold']} size={24} />;
      case 2:
        return <Medal className={styles['rank-icon-silver']} size={24} />;
      case 3:
        return <Award className={styles['rank-icon-bronze']} size={24} />;
      default:
        return <span className={styles['rank-number']}>#{rank}</span>;
    }
  };
  
  // Get rank styling class
  const getRankClass = (rank) => {
    switch(rank) {
      case 1:
        return styles['rank-first'];
      case 2:
        return styles['rank-second'];
      case 3:
        return styles['rank-third'];
      default:
        return '';
    }
  };

  return (
    <div className={styles['leaderboard-container']}>
      {/* Header */}
      <div className={styles['header-section']}>
        <div className={styles['header-content']}>
          <div className={styles['header-title-section']}>
            <Trophy className={styles['header-icon']} size={32} />
            <div>
              <h1 className={styles['header-title']}>Eco Leaderboard</h1>
              <p className={styles['header-subtitle']}>
                Top eco warriors making a difference
              </p>
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
          {/* Search */}
          <div className={styles['search-container']}>
            <Search className={styles['search-icon']} size={20} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles['search-input']}
            />
          </div>
          
          {/* School Filter */}
          <div className={styles['filter-container']}>
            <School className={styles['filter-icon']} size={18} />
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className={styles['filter-select']}
            >
              <option value="all">All Schools</option>
              {uniqueSchools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
            <ChevronDown className={styles['select-arrow']} size={16} />
          </div>
          
          {/* Class Filter */}
          <div className={styles['filter-container']}>
            <Target className={styles['filter-icon']} size={18} />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={styles['filter-select']}
            >
              <option value="all">All Classes</option>
              {uniqueClasses.sort().map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <ChevronDown className={styles['select-arrow']} size={16} />
          </div>
        </div>
      </div>

      {/* Leaderboard */}
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
                <div 
                  key={student.id} 
                  className={`${styles['student-card']} ${getRankClass(rank)}`}
                >
                  {/* Rank */}
                  <div className={styles['rank-section']}>
                    {getRankIcon(rank)}
                  </div>
                  
                  {/* Student Info */}
                  <div className={styles['student-info']}>
                    <div className={styles['avatar']}>
                      {student.avatar}
                    </div>
                    <div className={styles['student-details']}>
                      <h3 className={styles['student-name']}>{student.name}</h3>
                      <div className={styles['student-meta']}>
                        <span className={styles['school-name']}>
                          <School size={14} />
                          {student.school}
                        </span>
                        <span className={styles['class-name']}>
                          <Target size={14} />
                          Class {student.class}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Eco Points */}
                  <div className={styles['points-section']}>
                    <div className={styles['points-value']}>
                      {student.ecoPoints.toLocaleString()}
                    </div>
                    <div className={styles['points-label']}>
                      <Zap size={14} />
                      Eco Points
                    </div>
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