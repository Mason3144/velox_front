import { Helmet } from "react-helmet-async";

type IProps = {
  title: string;
};

const PageTitle = ({ title }: IProps) => {
  return (
    <Helmet>
      <title>{title} | InstaClone</title>
    </Helmet>
  );
};

export default PageTitle;
