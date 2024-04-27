"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleNextButtonClick = () => {
    router.push("/interview");
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Enter job description:
          <input type="text" className={styles.jobDescription} />
        </p>
        <div className={styles.centerButton}>
          <button className={styles.nextButton} onClick={handleNextButtonClick}>
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
