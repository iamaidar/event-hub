import { Link } from "react-router-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "solid" | "outline" | "dark";
    to?: string; // Используем "to" вместо "href" для react-router-dom
    text: string;
}

const Button: React.FC<ButtonProps> = ({ variant = "solid", text, to, className, ...props }) => {
    const baseStyles = "px-4 py-2 rounded-full text-sm font-semibold transition";

    const variants = {
        solid: "bg-purple-500 text-white hover:bg-purple-600 mb-2",
        outline: "border border-purple-500 text-purple-600 hover:bg-purple-100 mb-2",
        dark: "bg-[#04092C] text-white hover:bg-purple-100 mb-2",
    };

    if (to) {
        return (
            <Link to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
                {text}
            </Link>
        );
    }

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {text}
        </button>
    );
};

export default Button;
