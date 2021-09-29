import React from 'react';
import { Text, Small, Link, Ul, Li } from './Platform';
import { B, VerticalSpacer } from './Lib';

export default function PrivacyPolicy() {
  return (
    <>
      <Text h6><B>Privacy Policy</B></Text>
      <Text h6><Small>
        Robert Smith built the Deej-A.I. app as a Free app. This SERVICE is provided by Robert Smith at no
        cost and is intended for use as is.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        This page is used to inform visitors regarding my policies with the collection, use, and disclosure
        of Personal Information if anyone decided to use my Service.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        If you choose to use my Service, then you agree to the collection and use of information in relation
        to this policy. The Personal Information that I collect is used for providing and improving the Service.
        I will not use or share your information with anyone except as described in this Privacy Policy.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is
        accessible at Deej-A.I. unless otherwise defined in this Privacy Policy.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><B>Information Collection and Use</B></Text>
      <Text h6><Small>
        For a better experience, while using our Service, I may require you to provide us with certain personally
        identifiable information. The information that I request will be retained on your device and is not
        collected by me in any way.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        The app does use third party services that may collect information used to identify you.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        Link to privacy policy of third party service providers used by the app
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        <Ul>
          <Li><Link
            url='https://www.google.com/policies/privacy/'
            text='Google Play Services'
          />
          </Li>
        </Ul>
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><B>Log Data</B></Text>
      <Text h6><Small>
        I want to inform you that whenever you use my Service, in a case of an error in the app I collect data
        and information (through third party products) on your phone called Log Data. This Log Data may include
        information such as your device Internet Protocol (“IP”) address, device name, operating system version,
        the configuration of the app when utilizing my Service, the time and date of your use of the Service,
        and other statistics.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><B>Cookies</B></Text>
      <Text h6><Small>
        Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers.
        These are sent to your browser from the websites that you visit and are stored on your device's internal
        memory.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        This Service does not use these “cookies” explicitly. However, the app may use third party code and
        libraries that use “cookies” to collect information and improve their services. You have the option to
        either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose
        to refuse our cookies, you may not be able to use some portions of this Service.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><B>Service Providers</B></Text>
      <Text h6><Small>
        I may employ third-party companies and individuals due to the following reasons:
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        <Ul>
          <Li><Text>To facilitate our Service;</Text></Li>
          <Li><Text>To provide the Service on our behalf;</Text></Li>
          <Li><Text>To perform Service-related services; or</Text></Li>
          <Li><Text>To assist us in analyzing how our Service is used.</Text></Li>
        </Ul>
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        I want to inform users of this Service that these third parties have access to your Personal Information.
        The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to
        disclose or use the information for any other purpose.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><B>Security</B></Text>
      <Text h6><Small>
        I value your trust in providing us your Personal Information, thus we are striving to use commercially
        acceptable means of protecting it. But remember that no method of transmission over the internet, or
        method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><B>Links to Other Sites</B></Text>
      <Text h6><Small>
        This Service may contain links to other sites. If you click on a third-party link, you will be directed
        to that site. Note that these external sites are not operated by me. Therefore, I strongly advise you to
        review the Privacy Policy of these websites. I have no control over and assume no responsibility for the
        content, privacy policies, or practices of any third-party sites or services.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><B>Children’s Privacy</B></Text>
      <Text h6><Small>
        These Services do not address anyone under the age of 13. I do not knowingly collect personally
        identifiable information from children under 13. In the case I discover that a child under 13 has
        provided me with personal information, I immediately delete this from our servers. If you are a parent or
        guardian and you are aware that your child has provided us with personal information, please contact me
        so that I will be able to do necessary actions.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><B>Changes to This Privacy Policy</B></Text>
      <Text h6><Small>
        I may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically
        for any changes. I will notify you of any changes by posting the new Privacy Policy on this page.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        This policy is effective as of 2020-08-31
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><B>Contact Us</B></Text>
      <Text h6><Small>
        If you have any questions or suggestions about my Privacy Policy, do not hesitate to contact me at Robert
        Smith.
      </Small></Text>
      <VerticalSpacer px={15} />
      <Text h6><Small>
        This privacy policy page was created at <Link
          url='https://privacypolicytemplate.net'
          text='privacypolicytemplate.net'
        /> and modified/generated by <Link
          url='https://app-privacy-policy-generator.firebaseapp.com/'
          text='App Privacy Policy Generator'
        />
      </Small></Text>
    </>
  );
}
