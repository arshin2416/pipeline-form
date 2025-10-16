import React from "react";
import { cn } from "@/utils/cn";
import { getInitials, getAvatarColor } from "@/utils/formatters";

const Avatar = ({ 
  name, 
  src, 
  size = "md", 
  className 
}) => {
  const sizes = {
    sm: "h-6 w-6 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full border-2 border-white object-cover",
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full border-2 border-white flex items-center justify-center text-white font-medium",
        getAvatarColor(name),
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;