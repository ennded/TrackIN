const CompanyItem = ({ company, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(company.companyName);

  const handleUpdate = async () => {
    try {
      const { data } = await axios.patch(`/api/companies/${company._id}`, {
        companyName: editedName,
      });
      onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="group relative p-4 bg-white rounded shadow mb-4">
      {isEditing ? (
        <input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="border p-2 w-full"
        />
      ) : (
        <h3 className="text-xl font-semibold">{company.companyName}</h3>
      )}

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mr-2 text-blue-500 hover:text-blue-700"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        <button
          onClick={() => onDelete(company._id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
