const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/companies/search?term=${searchTerm}`
      );
      onSearch(data);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="bg-gray-200 px-4 py-2 rounded">
          Search
        </button>
      </div>
    </form>
  );
};
