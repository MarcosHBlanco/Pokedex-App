import React from "react";

export default function SearchBar({
	searchTerm,
	setSearchTerm,
	handleSearch,
	placeHolder,
}) {
	return (
		<div className="flex items-center">
			<input
				type="text"
				placeholder={placeHolder}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="w-64 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-800"
			/>
			<button
				onClick={handleSearch}
				className="px-4 py-2 bg-purple-500 text-white rounded-r-lg shadow hover:bg-purple-600 active:scale-95"
			>
				Search
			</button>
		</div>
	);
}
