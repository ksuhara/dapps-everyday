import { useRouter } from "next/navigation";
import initializeFirebaseClient from "../lib/initFirebase";
import { signInWithPopup, signOut } from "firebase/auth";
import useFirebaseUser from "../hooks/useFirebaseUser";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const router = useRouter();

  const { auth, provider, db } = initializeFirebaseClient();
  const { user } = useFirebaseUser();
  const slashPayment = async () => {
    const response = await fetch(`/api/slash-checkout`, {
      method: "POST",
      body: JSON.stringify({
        userId: user!.uid,
      }),
    }).then((data) => data.json());
    console.log(response, "respense");
    router.push(response.checkout_url);
  };

  const SignInWithGoogle = async () => {
    try {
      signInWithPopup(auth, provider)
        .then((userCredential) => {
          const user = userCredential.user;
          const usersRef = doc(db, "users", user.uid);
          getDoc(usersRef).then(async (doc) => {
            if (!doc.exists()) {
              setDoc(
                usersRef,
                {
                  name: user.displayName,
                  email: user.email,
                  role: "user",
                  createdAt: serverTimestamp(),
                },
                { merge: true }
              );
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={slashPayment}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Slash
      </button>
      <>
        {" "}
        {user ? (
          <>
            <button className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5">
              {user.displayName}
            </button>
            <button className="w-full px-6 py-2 mt-1 text-center text-white bg-gray-400 rounded-md lg:ml-5">
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={SignInWithGoogle}
            className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5"
          >
            Login
          </button>
        )}
      </>
    </main>
  );
}
