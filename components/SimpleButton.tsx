export default function SimpleButton({ children, color = "blue" }: { children: string, color?: string }) {
  const colorClass = color === "blue" ? "bg-blue-600 hover:bg-blue-700" : 
                     color === "green" ? "bg-green-600 hover:bg-green-700" :
                     "bg-purple-600 hover:bg-purple-700";
  
  return (
    <button className={`${colorClass} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}>
      {children}
    </button>
  );
}
