"use client";

import ErrorComp from "./_components/UI/ErrorComp/ErrorComp";

type Props = {
   error: Error;
   reset: () => void;
};

export default function Error({ error, reset }: Props) {
   return <ErrorComp error={error} reset={reset} />;
}
