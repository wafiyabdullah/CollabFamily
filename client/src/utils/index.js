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
    High: "text-red-600 bg-red-200",
    Medium: "text-yellow-600 bg-yellow-200",
    Low: "text-green-600  bg-green-200",
  };

export const PRIORITY_AFTER = {
    High: "text-red-300 bg-red-100",
    Medium: "text-yellow-300 bg-yellow-100",
    Low: "text-green-300 bg-green-100",
  };

export const TASK_TYPE = {
    Complete: "bg-green-600",
    Incomplete: "bg-red-600",
    Unpaid: "bg-red-600",
    Paid: "bg-green-600",
  };

export const TASK_AFTER = {
    Complete: "bg-green-300",
    Incomplete: "bg-red-300",
    Unpaid: "bg-red-300",
    Paid: "bg-green-300",
};

export const CATEGORY = {
    Utilities: "bg-blue-200 text-blue-600",
    Loans: "bg-cyan-200 text-cyan-600",
    Rent: "bg-purple-200 text-purple-600",
    Insurance: "bg-green-200 text-green-600",
    Transportation: "bg-pink-200 text-pink-600",
    Subscriptions: "bg-fuchsia-200 text-fuchsia-600",
    CreditCards: "bg-red-200 text-red-600",
    Others: "bg-gray-200 text-gray-600",
};

export const CATEGORY_AFTER = {
    Utilities: "bg-blue-100 text-blue-300",
    Loans: "bg-cyan-100 text-cyan-300",
    Rent: "bg-purple-100 text-purple-300",
    Insurance: "bg-green-100 text-green-300",
    Transportation: "bg-pink-100 text-pink-300",
    Subscriptions: "bg-fuchsia-100 text-fuchsia-300",
    CreditCards: "bg-red-100 text-red-300",
    Others: "bg-gray-100 text-gray-300",
};

export const BGS = [
    "bg-blue-600",
    "bg-cyan-600",
    "bg-purple-600",
    "bg-green-600",
    "bg-pink-600",
  ];
