const DebugPage = () => {
  const vars = [
    "VERCEL",
    "CI",
    "VERCEL_ENV",
    "VERCEL_URL",
    "VERCEL_BRANCH_URL",
    "VERCEL_REGION",
    "VERCEL_GIT_PROVIDER",
    "VERCEL_GIT_REPO_SLUG",
    "VERCEL_GIT_REPO_OWNER",
    "VERCEL_GIT_REPO_ID",
    "VERCEL_GIT_COMMIT_REF",
    "VERCEL_GIT_COMMIT_SHA",
    "VERCEL_GIT_COMMIT_MESSAGE",
    "VERCEL_GIT_COMMIT_AUTHOR_LOGIN",
    "VERCEL_GIT_COMMIT_AUTHOR_NAME",
    "VERCEL_GIT_PREVIOUS_SHA",
    "VERCEL_GIT_PULL_REQUEST_ID",
    "NEXT_PUBLIC_VERCEL_ENV",
    "NEXT_PUBLIC_VERCEL_URL",
    "NEXT_PUBLIC_VERCEL_BRANCH_URL",
    "NEXT_PUBLIC_VERCEL_GIT_PROVIDER",
    "NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG",
    "NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER",
    "NEXT_PUBLIC_VERCEL_GIT_REPO_ID",
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF",
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA",
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE",
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN",
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME",
    "NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID",
  ];
  return (
    <div className="flex justify-center">
      <table className="border border-slate-600">
        <tr>
          <th>Var</th>
          <th>Val</th>
        </tr>
        {vars.map((v) => {
          return (
            <tr>
              <td className="border border-slate-600 p-1">
                <pre>{v}</pre>
              </td>
              <td className="border border-slate-600 p-1">
                <pre>{process.env[v]}</pre>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};
export default DebugPage;
