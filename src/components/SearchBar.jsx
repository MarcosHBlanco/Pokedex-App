export default function SearchBar({ searchTerm, setSearchTerm, handleSearch }) {
	return (
		<div>
			<input
				className="border-b-gray-800 border-2 rounded m-2"
				type="text"
				placeholder="Search Pokemon:"
				value={searchTerm}
				onChange={(e) => {
					setSearchTerm(e.target.value), console.log(searchTerm);
				}}
			/>
			<button
				className=" p-1 border rounded border-slate-700 hover:bg-slate-500 hover:text-white hover:cursor-pointer"
				onClick={handleSearch}
			>
				Search
			</button>
		</div>
	);
}
