import { useEffect, useMemo, useState } from 'react';
import api from '../../axios';

const STATUS_OPTIONS = [
	{ value: 'all', label: 'All' },
	{ value: 'applied', label: 'Applied' },
	{ value: 'readyForInterview', label: 'Ready for Interview' },
	{ value: 'hired', label: 'Hired' },
	{ value: 'rejected', label: 'Rejected' }
];

function statusBadgeColor(status) {
	switch (status) {
		case 'applied':
			return 'bg-blue-100 text-blue-700 border-blue-200';
		case 'readyForInterview':
			return 'bg-amber-100 text-amber-700 border-amber-200';
		case 'hired':
			return 'bg-emerald-100 text-emerald-700 border-emerald-200';
		case 'rejected':
			return 'bg-rose-100 text-rose-700 border-rose-200';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-200';
	}
}

function formatDate(value) {
	if (!value) return '-';
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return '-';
	return d.toLocaleDateString();
}

function CardView({ jobs, onEdit, onDelete }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{jobs.map(job => (
				<div key={job._id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
					<div className="flex items-start justify-between gap-2">
						<div>
							<h3 className="text-base font-semibold text-gray-900">
								{job.jobInfo?.jobTitle || 'Untitled role'}
							</h3>
							<p className="text-sm text-gray-600">{job.jobInfo?.companyName || 'Unknown company'}</p>
						</div>
						<span className={`px-2 py-1 text-xs rounded-md border ${statusBadgeColor(job.status)}`}>
							{job.status}
						</span>
					</div>

					<div className="mt-3 space-y-1 text-sm text-gray-700">
						<p><span className="font-medium">Location:</span> {job.jobInfo?.location || '—'}</p>
						<p><span className="font-medium">Employment:</span> {job.jobInfo?.employmentType || '—'}</p>
						<p><span className="font-medium">Work setup:</span> {job.jobInfo?.workArrangement || '—'}</p>
						<p><span className="font-medium">Interview:</span> {formatDate(job.interviewDate)}</p>
					</div>

					<div className="mt-4 flex items-center justify-between gap-2">
						{job.jobInfo?.applicationLink ? (
							<a
								href={job.jobInfo?.applicationLink}
								target="_blank"
								rel="noreferrer"
								className="text-xs text-blue-600 hover:underline"
							>
								View application
							</a>
						) : <span />}
						<div className="flex items-center gap-2">
							<button onClick={() => onEdit(job)} className="text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50">Edit</button>
							<button onClick={() => onDelete(job)} className="text-xs px-3 py-1 rounded-md border border-rose-300 text-rose-700 hover:bg-rose-50">Delete</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function TableView({ jobs, onEdit, onDelete }) {
	return (
		<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<table className="min-w-full text-sm">
				<thead className="bg-gray-50 text-left text-gray-700">
					<tr>
						<th className="px-4 py-3 font-semibold">Role</th>
						<th className="px-4 py-3 font-semibold">Company</th>
						<th className="px-4 py-3 font-semibold">Status</th>
						<th className="px-4 py-3 font-semibold">Interview</th>
						<th className="px-4 py-3 font-semibold">Location</th>
						<th className="px-4 py-3 font-semibold">Actions</th>
					</tr>
				</thead>
				<tbody>
					{jobs.map(job => (
						<tr key={job._id} className="border-t border-gray-100">
							<td className="px-4 py-3">{job.jobInfo?.jobTitle || 'Untitled role'}</td>
							<td className="px-4 py-3">{job.jobInfo?.companyName || 'Unknown'}</td>
							<td className="px-4 py-3">
								<span className={`px-2 py-1 text-xs rounded-md border ${statusBadgeColor(job.status)}`}>{job.status}</span>
							</td>
							<td className="px-4 py-3">{formatDate(job.interviewDate)}</td>
							<td className="px-4 py-3">{job.jobInfo?.location || '—'}</td>
							<td className="px-4 py-3">
								<div className="flex items-center gap-2">
									<button onClick={() => onEdit(job)} className="text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50">Edit</button>
									<button onClick={() => onDelete(job)} className="text-xs px-3 py-1 rounded-md border border-rose-300 text-rose-700 hover:bg-rose-50">Delete</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function AddEditJobModal({ open, initialJob, onClose, onSubmit }) {
	const [formValues, setFormValues] = useState(() => ({
		jobTitle: initialJob?.jobInfo?.jobTitle || '',
		companyName: initialJob?.jobInfo?.companyName || '',
		location: initialJob?.jobInfo?.location || '',
		workArrangement: initialJob?.jobInfo?.workArrangement || '',
		employmentType: initialJob?.jobInfo?.employmentType || '',
		applicationLink: initialJob?.jobInfo?.applicationLink || '',
		shortDescription: initialJob?.jobInfo?.shortDescription || '',
		status: initialJob?.status || 'applied',
		interviewDate: initialJob?.interviewDate ? new Date(initialJob.interviewDate).toISOString().slice(0, 10) : ''
	}));

	useEffect(() => {
		if (open) {
			setFormValues({
				jobTitle: initialJob?.jobInfo?.jobTitle || '',
				companyName: initialJob?.jobInfo?.companyName || '',
				location: initialJob?.jobInfo?.location || '',
				workArrangement: initialJob?.jobInfo?.workArrangement || '',
				employmentType: initialJob?.jobInfo?.employmentType || '',
				applicationLink: initialJob?.jobInfo?.applicationLink || '',
				shortDescription: initialJob?.jobInfo?.shortDescription || '',
				status: initialJob?.status || 'applied',
				interviewDate: initialJob?.interviewDate ? new Date(initialJob.interviewDate).toISOString().slice(0, 10) : ''
			});
		}
	}, [open, initialJob]);

	function handleChange(e) {
		const { name, value } = e.target;
		setFormValues(prev => ({ ...prev, [name]: value }));
	}

	function handleSubmit(e) {
		e.preventDefault();
		onSubmit({
			jobInfo: {
				jobTitle: formValues.jobTitle,
				companyName: formValues.companyName,
				location: formValues.location,
				workArrangement: formValues.workArrangement,
				employmentType: formValues.employmentType,
				applicationLink: formValues.applicationLink,
				shortDescription: formValues.shortDescription
			},
			myJob: {
				status: formValues.status,
				interviewDate: formValues.interviewDate || null
			},
			moreInfo: {
				sourceSite: initialJob?.moreInfo?.sourceSite || 'manual',
				sourceUrl: initialJob?.moreInfo?.sourceUrl || '',
				originalJobId: initialJob?.moreInfo?.originalJobId || ''
			}
		});
	}

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
			<div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
				<div className="flex items-center justify-between border-b border-gray-200 p-4">
					<h2 className="text-base font-semibold text-gray-900">{initialJob ? 'Edit job' : 'Add job'}</h2>
					<button onClick={onClose} className="rounded-md px-2 py-1 text-sm hover:bg-gray-100">✕</button>
				</div>
				<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
					<div className="col-span-1">
						<label className="block text-xs font-medium text-gray-700">Job title</label>
						<input name="jobTitle" required value={formValues.jobTitle} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
					</div>
					<div className="col-span-1">
						<label className="block text-xs font-medium text-gray-700">Company</label>
						<input name="companyName" required value={formValues.companyName} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
					</div>
					<div className="col-span-1">
						<label className="block text-xs font-medium text-gray-700">Location</label>
						<input name="location" value={formValues.location} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
					</div>
					<div className="col-span-1">
						<label className="block text-xs font-medium text-gray-700">Work arrangement</label>
						<select name="workArrangement" value={formValues.workArrangement} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
							<option value="">Select</option>
							<option value="onSite">On-site</option>
							<option value="hybrid">Hybrid</option>
							<option value="remote">Remote</option>
							<option value="flexTime">Flex-time</option>
						</select>
					</div>
					<div className="col-span-1">
						<label className="block text-xs font-medium text-gray-700">Employment type</label>
						<select name="employmentType" value={formValues.employmentType} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
							<option value="">Select</option>
							<option value="partTime">Part-time</option>
							<option value="fullTime">Full-time</option>
							<option value="contract">Contract</option>
							<option value="selfEmployed">Self-employed</option>
							<option value="internship">Internship</option>
						</select>
					</div>
					<div className="col-span-1">
						<label className="block text-xs font-medium text-gray-700">Application link</label>
						<input name="applicationLink" value={formValues.applicationLink} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
					</div>
					<div className="col-span-2">
						<label className="block text-xs font-medium text-gray-700">Short description</label>
						<textarea name="shortDescription" rows={3} value={formValues.shortDescription} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
					</div>
					<div className="col-span-1">
						<label className="block text-xs font-medium text-gray-700">Status</label>
						<select name="status" value={formValues.status} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
							<option value="applied">Applied</option>
							<option value="readyForInterview">Ready for interview</option>
							<option value="hired">Hired</option>
							<option value="rejected">Rejected</option>
						</select>
					</div>
					<div className="col-span-1">
						<label className="block text-xs font-medium text-gray-700">Interview date</label>
						<input name="interviewDate" type="date" value={formValues.interviewDate} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
					</div>
					<div className="col-span-2 flex items-center justify-end gap-2 pt-2">
						<button type="button" onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
						<button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{initialJob ? 'Save changes' : 'Add job'}</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function MyJobsPage() {
	const [jobs, setJobs] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [view, setView] = useState('table');
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [jobBeingEdited, setJobBeingEdited] = useState(null);

	useEffect(() => {
		let ignore = false;
		async function fetchJobs() {
			try {
				setIsLoading(true);
				setErrorMessage('');
				// Expected response shape: Array<{ _id, status, interviewDate, jobInfo: {...}, moreInfo: {...} }>
				const res = await api.get('/jobs/my');
				if (!ignore) setJobs(Array.isArray(res.data?.jobs) ? res.data.jobs : []);
			} catch (err) {
				if (!ignore) {
					setErrorMessage('Unable to load your jobs right now.');
					setJobs([]);
				}
			} finally {
				if (!ignore) setIsLoading(false);
			}
		}
		fetchJobs();
		return () => { ignore = true };
	}, []);

	const filteredJobs = useMemo(() => {
		const text = searchText.trim().toLowerCase();
		return jobs.filter(j => {
			const matchesStatus = statusFilter === 'all' ? true : j.status === statusFilter;
			const hay = `${j.jobInfo?.jobTitle || ''} ${j.jobInfo?.companyName || ''}`.toLowerCase();
			const matchesText = text ? hay.includes(text) : true;
			return matchesStatus && matchesText;
		});
	}, [jobs, searchText, statusFilter]);

	function openAddModal() {
		setJobBeingEdited(null);
		setIsModalOpen(true);
	}

	function openEditModal(job) {
		setJobBeingEdited(job);
		setIsModalOpen(true);
	}

	async function handleDelete(job) {
		const confirmDelete = window.confirm('Delete this job entry?');
		if (!confirmDelete) return;
		try {
			await api.delete(`/jobs/${job._id}`);
			setJobs(prev => prev.filter(j => j._id !== job._id));
		} catch (e) {
			alert('Failed to delete.');
		}
	}

	async function handleSubmit(payload) {
		try {
			if (jobBeingEdited) {
				const res = await api.put(`/jobs/${jobBeingEdited._id}` , payload);
				if (res?.data?.job) {
					setJobs(prev => prev.map(j => j._id === jobBeingEdited._id ? res.data.job : j));
				}
			} else {
				// Backend is expected to create entries in jobsInfo, jobsMoreInfo, and myJob collections based on this composite payload
				const res = await api.post('/jobs', payload);
				if (res?.data?.job) {
					setJobs(prev => [res.data.job, ...prev]);
				}
			}
			setIsModalOpen(false);
			setJobBeingEdited(null);
		} catch (e) {
			alert('Failed to save.');
		}
	}

	const countsByStatus = useMemo(() => {
		return jobs.reduce((acc, j) => {
			acc[j.status] = (acc[j.status] || 0) + 1;
			return acc;
		}, {});
	}, [jobs]);

	return (
		<div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
			<div className="mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
				<h1 className="text-xl font-bold text-gray-900">My Jobs</h1>
				<div className="flex items-center gap-2">
					<div className="inline-flex rounded-md border border-gray-200 p-1">
						<button
							onClick={() => setView('table')}
							className={`px-3 py-1.5 text-sm rounded-md ${view === 'table' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
						>
							Table
						</button>
						<button
							onClick={() => setView('card')}
							className={`px-3 py-1.5 text-sm rounded-md ${view === 'card' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
						>
							Cards
						</button>
					</div>
					<button onClick={openAddModal} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Add job</button>
				</div>
			</div>

			<div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
				<div className="col-span-2">
					<div className="relative">
						<input
							type="text"
							placeholder="Search by role or company..."
							value={searchText}
							onChange={e => setSearchText(e.target.value)}
							className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">⌕</span>
					</div>
				</div>
				<div className="col-span-1">
					<select
						value={statusFilter}
						onChange={e => setStatusFilter(e.target.value)}
						className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{STATUS_OPTIONS.map(opt => (
							<option key={opt.value} value={opt.value}>
								{opt.label}{opt.value !== 'all' ? ` (${countsByStatus[opt.value] || 0})` : ''}
							</option>
						))}
					</select>
				</div>
			</div>

			{isLoading && (
				<div className="rounded-md border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">Loading your jobs...</div>
			)}
			{!isLoading && errorMessage && (
				<div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">{errorMessage}</div>
			)}
			{!isLoading && !errorMessage && filteredJobs.length === 0 && (
				<div className="rounded-md border border-gray-200 bg-white p-8 text-center">
					<p className="text-sm text-gray-700">No jobs found. Try adjusting your search or add a job you applied to.</p>
					<div className="mt-4">
						<button onClick={openAddModal} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Add job</button>
					</div>
				</div>
			)}

			{!isLoading && !errorMessage && filteredJobs.length > 0 && (
				<div className="mt-2">
					{view === 'table' ? (
						<TableView jobs={filteredJobs} onEdit={openEditModal} onDelete={handleDelete} />
					) : (
						<CardView jobs={filteredJobs} onEdit={openEditModal} onDelete={handleDelete} />
					)}
				</div>
			)}

			<AddEditJobModal
				open={isModalOpen}
				initialJob={jobBeingEdited}
				onClose={() => { setIsModalOpen(false); setJobBeingEdited(null) }}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}


