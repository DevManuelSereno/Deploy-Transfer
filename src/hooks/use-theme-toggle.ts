"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export const useThemeToggle = () => {
	const { theme, setTheme, resolvedTheme } = useTheme();

	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		setIsDark(resolvedTheme === "dark");
	}, [resolvedTheme]);

	const styleId = "theme-transition-styles";

	const updateStyles = useCallback((css: string) => {
		if (typeof window === "undefined") return;

		let styleElement = document.getElementById(styleId) as HTMLStyleElement;

		if (!styleElement) {
			styleElement = document.createElement("style");
			styleElement.id = styleId;
			document.head.appendChild(styleElement);
		}

		styleElement.textContent = css;
	}, []);

	const toggleTheme = useCallback(() => {
		setIsDark(!isDark);

		const animation = createAnimation();

		updateStyles(animation.css);

		if (typeof window === "undefined") return;

		const switchTheme = () => {
			setTheme(theme === "light" ? "dark" : "light");
		};

		if (!document.startViewTransition) {
			switchTheme();
			return;
		}

		document.startViewTransition(switchTheme);
	}, [theme, setTheme, updateStyles, isDark]);

	return {
		isDark,
		setIsDark,
		toggleTheme,
	};
};

interface Animation {
	name: string;
	css: string;
}

export const createAnimation = (): Animation => {
	return {
		name: `circle-top-left`,
		css: `
     ::view-transition-group(root) {
      animation-duration: 0.7s;
      animation-timing-function: var(--expo-out);
    }
          
    ::view-transition-new(root) {
      animation-name: reveal-light-top-left;
    }

    ::view-transition-old(root),
    .dark::view-transition-old(root) {
      animation: none;
      z-index: -1;
    }
    .dark::view-transition-new(root) {
      animation-name: reveal-dark-top-left;
    }

    @keyframes reveal-dark-top-left {
      from {
        clip-path: circle(0% at 0% 0%);
      }
      to {
        clip-path: circle(150.0% at 0% 0%);
      }
    }

    @keyframes reveal-light-top-left {
      from {
         clip-path: circle(0% at 0% 0%);
      }
      to {
        clip-path: circle(150.0% at 0% 0%);
      }
    }
    `,
	};
};
