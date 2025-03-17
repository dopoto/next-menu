"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignUp } from "@clerk/nextjs";

interface ClerkAPIError {
  /**
   * A string code that represents the error, such as `username_exists_code`.
   */
  code: string;
  /**
   * A message that describes the error.
   */
  message: string;
  /**
   * A more detailed message that describes the error.
   */
  longMessage?: string;
  /**
   * Additional information about the error.
   */
  meta?: {
      paramName?: string;
      sessionId?: string;
      emailAddresses?: string[];
      identifiers?: string[];
      zxcvbn?: {
          suggestions: {
              code: string;
              message: string;
          }[];
      };
      permissions?: string[];
  };
}

interface VerificationResource   {
  error: ClerkAPIError | null;
}

interface SignUpVerificationsResource {
  emailAddress: VerificationResource;
  phoneNumber: VerificationResource;
  externalAccount: VerificationResource;
  web3Wallet: VerificationResource;
 
}

const getSignUpError = (verifications: SignUpVerificationsResource): string | undefined =>  {
  if(verifications.emailAddress.error){
    return verifications.emailAddress.error.code
  }
  if(verifications.phoneNumber.error){
    return verifications.phoneNumber.error.code
  }
  if(verifications.externalAccount.error){
    return verifications.externalAccount.error.code
  }
  if(verifications.web3Wallet.error){
    return verifications.web3Wallet.error.code
  }
}

export   function ClerkSignUp() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !signUp) return;

    const checkSignUpStatus = async () => {
      console.log(JSON.stringify(signUp, null, 2))
      if (signUp.status === "complete") {
        // Successful sign-up, redirect to dashboard or home
        router.push("/sign-up/add-org");
        return;

      }  

      const signUpError = getSignUpError(signUp.verifications)
      if(signUpError){
         router.push(`/sign-up-error?error=${signUpError}`);
      }
    };

    checkSignUpStatus();
  }, [isLoaded, signUp, router]);

  return (
    <SignUp    
      appearance={{
        elements: {
          headerTitle: "hidden",
          headerSubtitle: "hidden",
        },
      }}
    />
  );
}
