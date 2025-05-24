import { useEffect, useState, useRef } from "react";
import { jobsAPI } from "../services/api";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { Search, MapPin, Building2 } from "lucide-react";

interface Job {
  id: number;
  position: string;
  company: string;
  location: string;
  date: string;
  salary?: string;
  jobUrl: string;
  companyLogo?: string;
  agoTime?: string;
  keyword?: string;
}

interface JobsResponse {
  data: Job[];
  current_page: number;
  last_page: number;
  total: number;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState({ keyword: '', location: '', company: '' });
  const [searching, setSearching] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const debounceRef = useRef<number | null>(null);
  const prevSearch = useRef(search);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Jika search berubah, set page ke 1
    if (
      prevSearch.current.keyword !== search.keyword ||
      prevSearch.current.location !== search.location ||
      prevSearch.current.company !== search.company
    ) {
      setPage(1);
      prevSearch.current = search;
    }
    setSearching(true);
    debounceRef.current = window.setTimeout(() => {
      setLoading(true);
      jobsAPI
        .getAll({
          page,
          keyword: search.keyword || undefined,
          location: search.location || undefined,
          company: search.company || undefined,
        })
        .then((res) => {
          const resp: JobsResponse = res.data;
          setJobs(resp.data || []);
          setPage(resp.current_page || 1);
          setLastPage(resp.last_page || 1);
          setTotal(resp.total || 0);
          setLoading(false);
          setSearching(false);
          setIsInitialLoad(false);
        })
        .catch((err) => {
          setError("Gagal memuat data pekerjaan");
          setLoading(false);
          setSearching(false);
          setIsInitialLoad(false);
        });
    }, 500);
    // eslint-disable-next-line
  }, [search, page]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <PageHeader title="Lowongan Kerja Terbaru" description="Data hasil scraping dari berbagai sumber terpercaya" />
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-center">
        {/* Keyword */}
        <div className="relative w-full md:w-1/3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            id="keyword"
            type="text"
            className="form-input pl-10 pr-3 py-2 w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="Cari posisi, kata kunci..."
            value={search.keyword}
            onChange={e => setSearch(s => ({ ...s, keyword: e.target.value }))}
            autoComplete="off"
          />
        </div>
        {/* Location */}
        <div className="relative w-full md:w-1/4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <MapPin className="w-5 h-5" />
          </span>
          <input
            id="location"
            type="text"
            className="form-input pl-10 pr-3 py-2 w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="Lokasi"
            value={search.location}
            onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}
            autoComplete="off"
          />
        </div>
        {/* Company */}
        <div className="relative w-full md:w-1/4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Building2 className="w-5 h-5" />
          </span>
          <input
            id="company"
            type="text"
            className="form-input pl-10 pr-3 py-2 w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="Perusahaan"
            value={search.company}
            onChange={e => setSearch(s => ({ ...s, company: e.target.value }))}
            autoComplete="off"
          />
        </div>
      </div>
      {searching && !loading && <div className="text-center text-xs text-gray-400 mb-2">Mencari...</div>}
      {loading && !searching && (isInitialLoad || page > 1) && <div className="text-center py-8">Memuat data...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {jobs.map((job) => (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            key={job.id}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <Card>
              <div className="flex items-center mb-2">
                {job.companyLogo && (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-10 h-10 rounded mr-3 object-contain bg-white border"
                  />
                )}
                <div>
                  <div className="font-semibold text-lg text-primary-700">{job.position}</div>
                  <div className="text-sm text-gray-500">{job.company}</div>
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-1">{job.location}</div>
              <div className="text-xs text-gray-400 mb-1">Diposting: {job.date} {job.agoTime && `(${job.agoTime})`}</div>
              {job.salary && <div className="text-xs text-green-600 font-medium">{job.salary}</div>}
              {job.keyword && <div className="text-xs text-blue-500">{job.keyword}</div>}
            </Card>
          </a>
        ))}
      </div>
      {!loading && jobs.length === 0 && (
        <div className="text-center text-gray-400 py-16 text-xl font-semibold">Tidak ada lowongan ditemukan.</div>
      )}
      {/* Paging */}
      {lastPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="btn btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span className="px-2">Halaman {page} dari {lastPage}</span>
          <button
            className="btn btn-sm"
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs; 