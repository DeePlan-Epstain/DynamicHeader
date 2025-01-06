import * as React from "react";
import styles from "./DynamicHeader.module.scss";
import type { IDynamicHeaderProps } from "./IDynamicHeaderProps";
import getSP from "../../PnPjsConfig";
import "./DynamicHeader.css";
import { SPFI } from "@pnp/sp";

interface IDynamicHeaderState {
  currTime: Date;
  profilePicture: string;
  jobTitle: string;
}

export default class DynamicHeader extends React.Component<
  IDynamicHeaderProps,
  IDynamicHeaderState
> {
  constructor(props: IDynamicHeaderProps) {
    super(props);
    this.state = {
      currTime: new Date(),
      profilePicture: "",
      jobTitle: "",
    };
  }

  componentDidMount(): void {
    const sp = getSP(this.props.context);
    console.log("componentDidMount - sp:", sp);

    sp.profiles.myProperties().then((u) => {
      // Find the PictureURL entry in the array
      const pictureUrlEntry = u.UserProfileProperties.find(
        (item: any) => item.Key === "PictureURL"
      );
      // Access the Value property to get the URL
      const pictureUrl = pictureUrlEntry ? pictureUrlEntry.Value : null;
      this.setState({ profilePicture: pictureUrl });
    });
    this.getUser(sp);
  }

  getUser = async (sp: SPFI) => {
    let user = await sp.web.currentUser();
    const followers = await sp.profiles.getPropertiesFor(user.LoginName);

    const jobTitle = followers.UserProfileProperties.find(
      (prop: any) => prop.Key === "SPS-JobTitle"
    );
    this.setState({
      jobTitle: jobTitle.Value,
    });
  };
  // Check's if morning/noon/evening
  timeOfDay = () => {
    const hourOfDay = this.state.currTime.getHours();
    let retString = "";
    if (hourOfDay >= 6 && hourOfDay < 12) {
      retString = "בוקר טוב";
    } else if (hourOfDay >= 12 && hourOfDay < 17) {
      retString = "צהריים טובים";
    } else {
      retString = "ערב טוב";
    }
    return retString + ", " + this.props.userDisplayName + "!";
  };

  public render(): React.ReactElement<IDynamicHeaderProps> {
    return (
      <div>
        <div className="TitleHeader">
          <div className="TitleHeaderContainer">
            <span className="TitleHeaderText">{this.props.Title}</span>
          </div>
          <div style={{ marginTop: "30px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            >
              {this.timeOfDay()}
            </span>
            <br />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 500,
                fontFamily: "inherit",
              }}
            >
              תפקיד: {this.state.jobTitle}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
