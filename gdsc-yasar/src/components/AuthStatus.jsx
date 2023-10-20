import React from "react";
import { useRouteLoaderData, useFetcher } from "react-router-dom";

function AuthStatus() {
  // Get our logged in user, if they exist, from the root route loader data
  let { user } = useRouteLoaderData("root");
  let fetcher = useFetcher();

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  let isLoggingOut = fetcher.formData != null;

  return (
    <div>
      <p>Welcome {user}!</p>
      <fetcher.Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </fetcher.Form>
    </div>
  );
}
export default AuthStatus;
