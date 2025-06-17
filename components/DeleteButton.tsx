'use client';

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this confession?")) return;

    try {
      const res = await fetch(`/api/delete?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload(); // Or trigger state update
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}
