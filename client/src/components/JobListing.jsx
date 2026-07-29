import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";
import { motion, AnimatePresence } from "framer-motion";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);

  const initialLoad = useRef(true);
  const [showFilter, setShowFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [filterJobs, setFilterJobs] = useState(jobs);
  const [fade, setFade] = useState(true);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const prevSelectedCategory = useRef(selectedCategory);
  const prevSelectedLocation = useRef(selectedLocation);
  const prevSearchFilter = useRef({ ...searchFilter });

  const triggerTransition = (callback, shouldScroll = true) => {
    setFade(false);
    setTimeout(() => {
      callback();
      setFade(true);
      if (shouldScroll && !initialLoad.current) {
        document.getElementById("job-list")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);
  };

  useEffect(() => {
    const filterJobs = () => {
      const matchesCategory = (job) =>
        selectedCategory.length === 0 || selectedCategory.includes(job.category);

      const matchesLocation = (job) =>
        selectedLocation.length === 0 || selectedLocation.includes(job.location);

      const matchesTitle = (job) => {
        if (!searchFilter.title) return true;
        const query = searchFilter.title.toLowerCase();
        return (
          (job.title && job.title.toLowerCase().includes(query)) ||
          (job.companyId?.name && job.companyId.name.toLowerCase().includes(query)) ||
          (job.category && job.category.toLowerCase().includes(query))
        );
      };

      const matchesSearchLocation = (job) =>
        !searchFilter.location ||
        (job.location && job.location.toLowerCase().includes(searchFilter.location.toLowerCase()));

      const newFilteredJobs = jobs
        .slice()
        .filter(
          (job) =>
            matchesCategory(job) &&
            matchesLocation(job) &&
            matchesTitle(job) &&
            matchesSearchLocation(job)
        );

      setFilterJobs(newFilteredJobs);
      setCurrentPage(1);
    };

    const filtersChanged =
      prevSelectedCategory.current !== selectedCategory ||
      prevSelectedLocation.current !== selectedLocation ||
      JSON.stringify(prevSearchFilter.current) !== JSON.stringify(searchFilter);

    if (initialLoad.current) {
      filterJobs();
      initialLoad.current = false;
    } else {
      triggerTransition(filterJobs, filtersChanged);
    }

    prevSelectedCategory.current = selectedCategory;
    prevSelectedLocation.current = selectedLocation;
    prevSearchFilter.current = { ...searchFilter };
  }, [jobs, selectedCategory, selectedLocation, searchFilter]);

  const handleCategoryChange = (category) => {
    triggerTransition(() => {
      setSelectedCategory((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    });
  };

  const handleLocationChange = (location) => {
    triggerTransition(() => {
      setSelectedLocation((prev) =>
        prev.includes(location)
          ? prev.filter((c) => c !== location)
          : [...prev, location]
      );
    });
  };

  const handlePageChange = (newPage) => {
    triggerTransition(() => setCurrentPage(newPage));
  };

  const clearAllFilters = () => {
    triggerTransition(() => {
      setSelectedCategory([]);
      setSelectedLocation([]);
      setSearchFilter({ title: "", location: "" });
    });
  };

  return (
    <div className="container mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-10 px-4 lg:px-8">
      <motion.div
        className="w-full lg:w-1/4 bg-white/85 rounded-2xl border border-[#e7ddcf] shadow-[0_25px_70px_-55px_rgba(11,18,32,0.45)] lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0b1220] text-white rounded-lg lg:hidden w-full justify-center mb-4"
          >
            {showFilter ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Hide Filters
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Show Filters
              </>
            )}
          </button>

          {showFilter && (
            <>
              {(searchFilter.title !== "" || searchFilter.location !== "") && (
                <div className="mb-8 bg-[#f6f1e8] p-4 rounded-xl border border-[#e7ddcf]">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg text-[#0b1220]">Current Search</h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-[#0b1220] hover:text-[#ff5c2a]"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchFilter.title && (
                      <span className="inline-flex items-center gap-2 bg-white border border-[#f0e8db] px-3 py-1 rounded-full text-sm text-[#0b1220]">
                        {searchFilter.title}
                        <button
                          onClick={() => setSearchFilter((prev) => ({ ...prev, title: "" }))}
                          className="text-[#8c8376] hover:text-[#0b1220]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    )}
                    {searchFilter.location && (
                      <span className="inline-flex items-center gap-2 bg-white border border-[#f0e8db] px-3 py-1 rounded-full text-sm text-[#0b1220]">
                        {searchFilter.location}
                        <button
                          onClick={() => setSearchFilter((prev) => ({ ...prev, location: "" }))}
                          className="text-[#8c8376] hover:text-[#0b1220]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-[#0b1220]">Categories</h4>
                  {selectedCategory.length > 0 && (
                    <button
                      onClick={() => setSelectedCategory([])}
                      className="text-sm text-[#0b1220] hover:text-[#ff5c2a]"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <ul className="space-y-3">
                  {JobCategories.map((category, index) => (
                    <motion.li key={index} className="flex items-center" whileHover={{ x: 3 }}>
                      <input
                        className="h-4 w-4 text-[#0b1220] rounded focus:ring-[#ffb39b] border-[#d7cec0]"
                        type="checkbox"
                        onChange={() => handleCategoryChange(category)}
                        checked={selectedCategory.includes(category)}
                        id={`category-${index}`}
                      />
                      <label
                        htmlFor={`category-${index}`}
                        className="ml-3 text-[#3f3b34] cursor-pointer hover:text-[#0b1220] transition-colors"
                      >
                        {category}
                      </label>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-[#0b1220]">Locations</h4>
                  {selectedLocation.length > 0 && (
                    <button
                      onClick={() => setSelectedLocation([])}
                      className="text-sm text-[#0b1220] hover:text-[#ff5c2a]"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <ul className="space-y-3">
                  {JobLocations.slice(0, showAllLocations ? JobLocations.length : 5).map(
                    (location, index) => (
                      <motion.li key={index} className="flex items-center" whileHover={{ x: 3 }}>
                        <input
                          className="h-4 w-4 text-[#0b1220] rounded focus:ring-[#ffb39b] border-[#d7cec0]"
                          type="checkbox"
                          onChange={() => handleLocationChange(location)}
                          checked={selectedLocation.includes(location)}
                          id={`location-${index}`}
                        />
                        <label
                          htmlFor={`location-${index}`}
                          className="ml-3 text-[#3f3b34] cursor-pointer hover:text-[#0b1220] transition-colors"
                        >
                          {location}
                        </label>
                      </motion.li>
                    )
                  )}
                </ul>
                {JobLocations.length > 5 && (
                  <button
                    onClick={() => setShowAllLocations(!showAllLocations)}
                    className="mt-2 text-sm text-[#0b1220] hover:text-[#ff5c2a]"
                  >
                    {showAllLocations ? "Show less" : `Show all (${JobLocations.length})`}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>

      <section className="w-full lg:w-3/4 pl-0 lg:pl-8">
        <div className="mb-8">
          <h3 className="font-bold text-3xl md:text-4xl text-[#0b1220] mb-2" id="job-list">
            Latest Jobs
          </h3>
          <p className="text-[#6f685d]">Find your dream job from top companies worldwide</p>
        </div>

        <div className="lg:hidden mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full px-4 py-3 border border-[#d7cec0] rounded-lg focus:ring-2 focus:ring-[#ffb39b] focus:border-transparent bg-white"
              value={searchFilter.title}
              onChange={(e) => setSearchFilter({ ...searchFilter, title: e.target.value })}
            />
            <button className="absolute right-3 top-3 text-[#6f685d]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <p className="text-[#6f685d] mb-2 sm:mb-0">
            Showing <span className="font-semibold text-[#0b1220]">{filterJobs.length}</span> jobs
            {(selectedCategory.length > 0 || selectedLocation.length > 0) && (
              <span className="text-sm ml-2">
                (filtered by {selectedCategory.length > 0 ? `${selectedCategory.length} categor${selectedCategory.length > 1 ? "ies" : "y"}` : ""}
                {selectedCategory.length > 0 && selectedLocation.length > 0 ? " and " : ""}
                {selectedLocation.length > 0 ? `${selectedLocation.length} location${selectedLocation.length > 1 ? "s" : ""}` : ""})
              </span>
            )}
          </p>
          <div className="flex items-center">
            <label htmlFor="sort" className="text-[#6f685d] mr-2 text-sm">Sort by:</label>
            <select
              id="sort"
              className="border border-[#d7cec0] rounded-md px-3 py-1 text-sm focus:ring-[#ffb39b] focus:border-[#ffb39b] bg-white"
            >
              <option>Most Recent</option>
              <option>Highest Salary</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        <div className="relative min-h-[400px]">
          {filterJobs.length === 0 ? (
            <motion.div
              className="bg-white rounded-xl p-8 text-center border border-[#e7ddcf]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#6f685d] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-xl font-medium text-[#0b1220] mb-2">No jobs found</h4>
              <p className="text-[#6f685d] mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-[#0b1220] text-white rounded-lg hover:bg-[#151c2a] transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-300 ${
                fade ? "opacity-100" : "opacity-0"
              }`}
              layout
            >
              <AnimatePresence>
                {filterJobs
                  .slice((currentPage - 1) * 6, currentPage * 6)
                  .map((job, index) => (
                    <motion.div
                      key={job.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      layout
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {filterJobs.length > 0 && (
          <motion.div
            className="flex items-center justify-center space-x-2 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${currentPage === 1 ? "text-[#d7cec0]" : "text-[#0b1220] hover:bg-[#fff1e8]"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {Array.from({ length: Math.ceil(filterJobs.length / 6) }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  currentPage === index + 1
                    ? "bg-[#0b1220] text-white shadow-md"
                    : "text-[#6f685d] hover:bg-[#f0e8db]"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(filterJobs.length / 6)))}
              disabled={currentPage === Math.ceil(filterJobs.length / 6)}
              className={`p-2 rounded-full ${currentPage === Math.ceil(filterJobs.length / 6) ? "text-[#d7cec0]" : "text-[#0b1220] hover:bg-[#fff1e8]"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default JobListing;

