// Desc: Utility functions
export function getInitials(fullName){
    const names  = fullName.split(' ');

    const initials = names.slice(0,2).map((name) => name[0]?.toUpperCase() || '');

    const initialsStr = initials.join('');

    return initialsStr;

}

export const formatDate = (date) => {
    // Get the month, day, and year
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
  
    const formattedDate = `${day}-${month}-${year}`;
  
    return formattedDate;
  };

export function dateFormatter(dateString) {
    const inputDate = new Date(dateString);
  
    if (isNaN(inputDate)) {
      return "Invalid Date";
    }
  
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
  
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  
export const PRIORITY_STYLE = {
    High: "text-red-600",
    Medium: "text-yellow-600",
    Low: "text-green-600",
  };
  
export const TASK_TYPE = {
    Complete: "bg-green-600",
    Incomplete: "bg-red-600",
    Unpaid: "bg-red-600",
    Paid: "bg-green-600",
  };
  
export const BGS = [
    "bg-blue-600",
    "bg-cyan-600",
    "bg-purple-600",
    "bg-green-600",
    "bg-pink-600",
  ];
