"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { AnimatePresence } from "motion/react";

interface FormErrorMessageProps {
	message: string;
}

export function FormErrorMessage({ message }: FormErrorMessageProps) {
	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: "100%" }}
				animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
				exit={{ opacity: 0, y: "100%" }}
				className="absolute inset-x-0 z-99 bottom-0 px-6 py-3 border-t border-destructive/20 bg-destructive/10 backdrop-blur-lg text-destructive flex items-center gap-2"
			>
				<AlertCircle size={16} className="opacity-90" />
				<span className="text-sm">{message}</span>
			</motion.div>
		</AnimatePresence>
	);
}
