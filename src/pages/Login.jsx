import AuthForm from "../components/AuthForm";

export default function Login() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <AuthForm isLogin={true} />
        </div>
      </div>
    </div>
  );
}
