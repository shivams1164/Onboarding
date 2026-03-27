// Utility functions

export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 4) return phone;
  return `${'*'.repeat(6)}${phone.slice(-4)}`;
};

export const maskAadhar = (aadhar: string): string => {
  if (!aadhar || aadhar.length < 4) return aadhar;
  return `${'*'.repeat(8)}${aadhar.slice(-4)}`;
};

export const maskPan = (pan: string): string => {
  if (!pan || pan.length < 4) return pan;
  return `${'*'.repeat(7)}${pan.slice(-4)}`;
};

export const maskBankAccount = (account: string): string => {
  if (!account || account.length < 4) return account;
  return `${'*'.repeat(account.length - 4)}${account.slice(-4)}`;
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "INACTIVE":
      return "bg-gray-100 text-gray-800";
    case "ON_LEAVE":
      return "bg-yellow-100 text-yellow-800";
    case "TERMINATED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "INACTIVE":
      return "secondary";
    case "ON_LEAVE":
      return "outline";
    case "TERMINATED":
      return "destructive";
    default:
      return "secondary";
  }
};
