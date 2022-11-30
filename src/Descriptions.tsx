import { Fragment } from 'react';

type DescriptionsProps = {
  desc: string;
  type: string;
  requestFields: {
    type: string;
    desc: string;
  }[];
  responseFields: {
    type: string;
    desc: string;
  }[];
};

export const Descriptions: React.FC<DescriptionsProps> = ({
  desc,
  type,
  requestFields,
  responseFields,
}) => {
  return (
    <div className="flex flex-col">
      <p className="h3 mb-[24px]">{desc}</p>
      <p className="text_body mb-[12px]">{`${type}Request`}</p>
      <div className="w-[100%] flex flex-col bg-brown rounded-[15px] px-[24px] py-[12px]">
        <p className="text_body mb-[2px]">{`message ${type}Request {`}</p>
        {requestFields.map((i, index) => {
          return (
            <Fragment key={index}>
              <p className="text-light_brown text_body mb-[2px] ml-[12px]">
                {i.desc}
              </p>
              <p className="text_body ml-[12px]">{i.type}</p>
            </Fragment>
          );
        })}
        <p className="text_body mt-[2px]">{`}`}</p>
      </div>
      <p className="text_body mb-[12px] mt-[24px]">{`${type}Response`}</p>
      <div className="w-[100%] flex flex-col bg-brown rounded-[15px] px-[24px] py-[12px]">
        <p className="text_body mb-[2px]">{`message ${type}Response {`}</p>
        {responseFields.map((i, index) => {
          return (
            <Fragment key={index}>
              {i.desc && (
                <p className="text-light_brown text_body mb-[2px] ml-[12px]">
                  {i.desc}
                </p>
              )}
              {i.type && <p className="text_body ml-[12px]">{i.type}</p>}
            </Fragment>
          );
        })}
        <p className="text_body mt-[2px]">{`}`}</p>
      </div>
    </div>
  );
};
