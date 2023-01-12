import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ReactGA from "react-ga4";

ReactGA.initialize("G-0SBYTD29XZ");
ReactGA.send("pageview");

const randomInteger = (i) => {
  return Math.floor(i * Math.random());
}

const sliceIntoChunks = (arr, chunkSize) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const TriviaGame = ({ categoryId, categoryName, difficulty }) => {
  // Initialize state variables for the game
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [correctAnswerInsertionIndex, setCorrectAnswerInsertionIndex] = useState(0);
  const [quizLength, setQuizLength] = useState(1);

  let socialText = `I just scored ${Math.round(score / quizLength * 100)}% in the ${difficulty} ${categoryName.replace('Entertainment: ', '').replace('Science: ', '')} Trivia Game on Qwzya! Can you beat me?`

  // Generate the URLs for social sharing
  const socialUrls = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=https://qwzya.com&text=${socialText}&hashtags=games,trivia,quiz,quizzes,qwzya`,
    },
    {
      name: 'facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=https://qwzya.com`,
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=https://qwzya.com`,
    },
    {
      name: 'Reddit',
      url: `https://reddit.com/submit/?url=https://qwzya.com&title=${socialText}`,
    },
    // {
    //   name: 'Xing',
    //   url: `https://www.xing.com/social/share/spi?url=https://qwzya.com`,
    // },
    // {
    //   name: 'Hacker News',
    //   url: `https://news.ycombinator.com/submitlink?u=https://qwzya.com&t=${socialText}`,
    // },
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${socialText}`,
    },
    {
      name: 'email',
      url: `mailto:?&subject=Can you beat my score?&cc=&bcc=&body=https://qwzya.com ${socialText}`,
    },
  ]

  const tweetUrl = encodeURI(
    `https://twitter.com/intent/tweet?url=https://qwzya.com&text=${socialText}&hashtags=games,trivia,quiz,quizzes,qwzya`
  );

  const faceBookUrl = encodeURI(
    `https://www.facebook.com/sharer/sharer.php?u=https://qwzya.com`
  )

  const pinterestUrl = encodeURI(
    `https://twitter.com/intent/tweet?url=https://qwzya.com&text=${socialText}`
  )

  const linkedInUrl = encodeURI(
    `https://www.linkedin.com/shareArticle?mini=true&url=https://qwzya.com`
  )

  const emailUrl = encodeURI(
    `mailto:info@example.com?&subject=Can you beat my score?&cc=&bcc=&body=https://qwzya.com ${socialText}`
  )

  const redditUrl = encodeURI(
    `https://reddit.com/submit/?url=https://qwzya.com&title=${socialText}`
  )

  const xingUrl = encodeURI(
    `https://www.xing.com/social/share/spi?url=https://qwzya.com`
  )

  const hackerNewsUrl = encodeURI(
    `https://news.ycombinator.com/submitlink?u=https://qwzya.com&t=${socialText}`
  )

  // Fetch a set of questions from the Open Trivia DB API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=${quizLength}&category=${categoryId}&difficulty=${difficulty}&type=multiple`
        );
        setQuestions(response.data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [refresh]);

  // Assuming there are always four choices we can randomly get an index to put the answer at so that it's not always in the same place and therefore easily guessed
  useEffect(() => {
    setCorrectAnswerInsertionIndex(Math.floor(3 * Math.random()));
  }, [currentQuestionIndex])

  // Render the game UI
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>An error occurred: {error.message}</p>;
  }
  if (currentQuestionIndex >= questions.length) {
    return (


      <Card className='shadow-lg col-12 col-md-9 col-lg-6 m-auto'>
        <Card.Body>
          <Card.Title className='text-capitalize border-bottom pb-3 fs-6'>Game over!</Card.Title>
          <Card.Text className='fs-2'>
            Your score is: {Math.round(score / quizLength * 100)}%


          </Card.Text>
          <Card.Text className='m-4 pb-4 '>
            <p>Share your score</p>

            {socialUrls.map(social => <a href={encodeURI(social.url)} target="_blank" rel="noopener noreferrer"
              className='btn btn-tertiary me-2 border rounded mb-2'
            >
              <small><b>{social.name}</b></small>
            </a>)}



          </Card.Text>



        </Card.Body>

      </Card>



    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const decodedQuestion = decodeHTML(currentQuestion.question);

  // Handle the player selecting an answer
  const handleAnswer = (selectedAnswer) => {
    setShowingAnswer(true);
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
    }
    setTimeout(() => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowingAnswer(false);
    }, 1000);
  };

  return (
    <div className='fs-4'>
      <p className='p-8'></p>

      <div class="container">

        <div className='row mb-4'>
          <Card className='shadow-lg col-12 col-md-9 col-lg-6 m-auto'>
            <Card.Body>
              <Card.Title className='text-capitalize border-bottom pb-3 fs-6'>{difficulty} {categoryName.replace('Entertainment: ', '')
                .replace('Science: ', '')} Quiz</Card.Title>
              <Card.Text>
                {decodedQuestion}
              </Card.Text>
              <div class="row gap-2">
                {currentQuestion.incorrect_answers.map((answer, index) => (
                  <>
                    {index === correctAnswerInsertionIndex &&
                      <Button variant="secondary"
                        className='col-sm'
                        onClick={() => {
                          handleAnswer(decodeHTML(currentQuestion.correct_answer));
                        }}
                        style={
                          showingAnswer &&
                            decodeHTML(currentQuestion.correct_answer) === currentQuestion.correct_answer
                            ? { backgroundColor: 'green' }
                            : {}
                        }
                      >
                        {decodeHTML(currentQuestion.correct_answer)}
                      </Button>
                    }
                    <Button variant="secondary"
                      className='col-sm'
                      key={index}
                      onClick={() => {
                        handleAnswer(decodeHTML(answer));
                      }}
                      style={
                        showingAnswer && answer !== currentQuestion.correct_answer
                          ? { backgroundColor: 'red' }
                          : {}
                      }
                    >
                      {decodeHTML(answer)}
                    </Button>
                  </>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>


      </div>

      {/* <div className="d-grid gap-2 grid-cols cols-2">
        {currentQuestion.incorrect_answers.map((answer, index) => (
          <>
            {index === correctAnswerInsertionIndex &&
              <Button variant="secondary"
                className='col-1'
                onClick={() => {
                  handleAnswer(decodeHTML(currentQuestion.correct_answer));
                }}
                style={
                  showingAnswer &&
                    decodeHTML(currentQuestion.correct_answer) === currentQuestion.correct_answer
                    ? { backgroundColor: 'green' }
                    : {}
                }
              >
                {decodeHTML(currentQuestion.correct_answer)}
              </Button>
            }
            <Button variant="secondary"
              className='col-1'
              key={index}
              onClick={() => {
                handleAnswer(decodeHTML(answer));
              }}
              style={
                showingAnswer && answer !== currentQuestion.correct_answer
                  ? { backgroundColor: 'red' }
                  : {}
              }
            >
              {decodeHTML(answer)}
            </Button>
          </>
        ))}

      </div> */}
      <p>
        Correct: {score} Incorrect: {incorrectCount}
      </p>
    </div>
  );
};

const App = () => {

  const [gameStarted, setGameStarted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 9 is general knowledge from api
  const [selectedCategoryId, setSelectedCategoryId] = useState(9);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [viewPrivacy, setViewPrivacy] = useState(false);
  const [viewAbout, setViewAbout] = useState(false);
  const [viewGame, setViewGame] = useState(true);

  // Fetch categories from the Open Trivia DB API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api_category.php');
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const date = new Date();


  return (
    <div className='container container-xxl text-center p-4'>
      <img src={logo} alt="Qwzya" className='logo mb-2' width="20%" />
      <p><small>Fun trivia games for free!<br />Compare with friends on social media!</small></p>
      <hr />

      {viewPrivacy && 
      <div className="container">
        <a href="#" className='float-end' onClick={() => {setViewPrivacy(false);setViewAbout(false);setViewGame(true);}}>close</a>
        <div className='text-start'>
        PRIVACY NOTICE<br />
        <br />
        Last updated January 12, 2023<br />
        <br />
        <br />
        <br />
        This privacy notice for Qwzya Entertainment & Education &#40; " Company ," "we," "us," or "our" &#41;, describes how and why we might collect, store, use, and/or share &#40; "process" &#41; your information when you use our services &#40; "Services" &#41;, such as when you:<br />
        Visit our website at http://www.qwzya.com , or any website of ours that links to this privacy notice<br />
        Download and use our mobile application &#40; Qwzya&#41; , or any other application of ours that links to this privacy notice<br />
        Engage with us in other related ways, including any sales, marketing, or events<br />
        Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at support@qwzya.com .<br />
        <br />
        <br />
        SUMMARY OF KEY POINTS<br />
        <br />
        This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for. You can also click here to go directly to our table of contents.<br />
        <br />
        What personal information do we process? When you visit, use, or navigate our Services, we may process personal information depending on how you interact with Qwzya Entertainment & Education and the Services, the choices you make, and the products and features you use. Click here to learn more.<br />
        <br />
        Do we process any sensitive personal information? We do not process sensitive personal information.<br />
        <br />
        Do we receive any information from third parties? We do not receive any information from third parties.<br />
        <br />
        How do we process your information? We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Click here to learn more.<br />
        <br />
        In what situations and with which parties do we share personal information? We may share information in specific situations and with specific third parties. Click here to learn more.<br />
        <br />
        How do we keep your information safe? We have organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Click here to learn more.<br />
        <br />
        What are your rights? Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Click here to learn more.<br />
        <br />
        How do you exercise your rights? The easiest way to exercise your rights is by filling out our data subject request form available here: http://www.qwzya.com/privacy , or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.<br />
        <br />
        Want to learn more about what Qwzya Entertainment & Education does with any information we collect? Click here to review the notice in full.<br />
        <br />
        <br />
        TABLE OF CONTENTS<br />
        <br />
        1. WHAT INFORMATION DO WE COLLECT?<br />
        2. HOW DO WE PROCESS YOUR INFORMATION?<br />
        3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?<br />
        4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?<br />
        5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?<br />
        6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?<br />
        7. HOW DO WE HANDLE YOUR SOCIAL LOGINS?<br />
        8. HOW LONG DO WE KEEP YOUR INFORMATION?<br />
        9. HOW DO WE KEEP YOUR INFORMATION SAFE?<br />
        10. DO WE COLLECT INFORMATION FROM MINORS?<br />
        11. WHAT ARE YOUR PRIVACY RIGHTS?<br />
        12. CONTROLS FOR DO-NOT-TRACK FEATURES<br />
        13. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?<br />
        14. DO WE MAKE UPDATES TO THIS NOTICE?<br />
        15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?<br />
        16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?<br />
        <br />
        <br />
        1. WHAT INFORMATION DO WE COLLECT?<br />
        <br />
        Personal information you disclose to us<br />
        <br />
        In Short: We collect personal information that you provide to us.<br />
        <br />
        We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.<br />
        <br />
        Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:<br />
        email addresses<br />
        usernames<br />
        passwords<br />
        contact preferences<br />
        contact or authentication data<br />
        mailing addresses<br />
        names<br />
        phone numbers<br />
        geolocation<br />
        Sensitive Information. We do not process sensitive information.<br />
        <br />
        Social Media Login Data. We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called " HOW DO WE HANDLE YOUR SOCIAL LOGINS? " below.<br />
        <br />
        Application Data. If you use our application&#40;s&#41;, we also may collect the following information if you choose to provide us with access or permission:<br />
        Geolocation Information. We may request access or permission to track location-based information from your mobile device, either continuously or while you are using our mobile application&#40;s&#41;, to provide certain location-based services. If you wish to change our access or permissions, you may do so in your device's settings.<br />
        Mobile Device Data. We automatically collect device information &#40;such as your mobile device ID, model, and manufacturer&#41;, operating system, version information and system configuration information, device and application identification numbers, browser type and version, hardware model Internet service provider and/or mobile carrier, and Internet Protocol &#40;IP&#41; address &#40;or proxy server&#41;. If you are using our application&#40;s&#41;, we may also collect information about the phone network associated with your mobile device, your mobile device’s operating system or platform, the type of mobile device you use, your mobile device’s unique device ID, and information about the features of our application&#40;s&#41; you accessed.<br />
        Push Notifications. We may request to send you push notifications regarding your account or certain features of the application&#40;s&#41;. If you wish to opt out from receiving these types of communications, you may turn them off in your device's settings.<br />
        This information is primarily needed to maintain the security and operation of our application&#40;s&#41;, for troubleshooting, and for our internal analytics and reporting purposes.<br />
        <br />
        All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.<br />
        <br />
        Information automatically collected<br />
        <br />
        In Short: Some information — such as your Internet Protocol &#40;IP&#41; address and/or browser and device characteristics — is collected automatically when you visit our Services.<br />
        <br />
        We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity &#40;like your name or contact information&#41; but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.<br />
        <br />
        Like many businesses, we also collect information through cookies and similar technologies.<br />
        <br />
        The information we collect includes:<br />
        Log and Usage Data. Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services &#40;such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use&#41;, device event information &#40;such as system activity, error reports &#40;sometimes called "crash dumps" &#41;, and hardware settings&#41;.<br />
        Device Data. We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address &#40;or proxy server&#41;, device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.<br />
        Location Data. We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location &#40;based on your IP address&#41;. You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.<br />
        2. HOW DO WE PROCESS YOUR INFORMATION?<br />
        <br />
        In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.<br />
        <br />
        We process your personal information for a variety of reasons, depending on how you interact with our Services, including:<br />
        To facilitate account creation and authentication and otherwise manage user accounts. We may process your information so you can create and log in to your account, as well as keep your account in working order.<br />
        <br />
        <br />
        <br />
        <br />
        To request feedback. We may process your information when necessary to request feedback and to contact you about your use of our Services.<br />
        To send you marketing and promotional communications. We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time. For more information, see " WHAT ARE YOUR PRIVACY RIGHTS? " below&#41;.<br />
        To deliver targeted advertising to you. We may process your information to develop and display personalized content and advertising tailored to your interests, location, and more.<br />
        To protect our Services. We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.<br />
        To identify usage trends. We may process information about how you use our Services to better understand how they are being used so we can improve them.<br />
        To determine the effectiveness of our marketing and promotional campaigns. We may process your information to better understand how to provide marketing and promotional campaigns that are most relevant to you.<br />
        To save or protect an individual's vital interest. We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm.<br />
        <br />
        3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?<br />
        <br />
        In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason &#40;i.e. , legal basis&#41; to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.<br />
        <br />
        If you are located in the EU or UK, this section applies to you.<br />
        <br />
        The General Data Protection Regulation &#40;GDPR&#41; and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:<br />
        Consent. We may process your information if you have given us permission &#40;i.e. , consent&#41; to use your personal information for a specific purpose. You can withdraw your consent at any time. Click here to learn more.<br />
        Legitimate Interests. We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:<br />
        Send users information about special offers and discounts on our products and services<br />
        Develop and display personalized and relevant advertising content for our users<br />
        Analyze how our Services are used so we can improve them to engage and retain users<br />
        Support our marketing activities<br />
        Diagnose problems and/or prevent fraudulent activities<br />
        Understand how our users use our products and services so we can improve user experience<br />
        Legal Obligations. We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.<br />
        Vital Interests. We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.<br />
        <br />
        If you are located in Canada, this section applies to you.<br />
        <br />
        We may process your information if you have given us specific permission &#40;i.e. , express consent&#41; to use your personal information for a specific purpose, or in situations where your permission can be inferred &#40;i.e. , implied consent&#41;. You can withdraw your consent at any time. Click here to learn more.<br />
        <br />
        In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:<br />
        If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way<br />
        For investigations and fraud detection and prevention<br />
        For business transactions provided certain conditions are met<br />
        If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim<br />
        For identifying injured, ill, or deceased persons and communicating with next of kin<br />
        If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse<br />
        If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province<br />
        If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records<br />
        If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced<br />
        If the collection is solely for journalistic, artistic, or literary purposes<br />
        If the information is publicly available and is specified by the regulations<br />
        <br />
        4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?<br />
        <br />
        In Short: We may share information in specific situations described in this section and/or with the following third parties.<br />
        <br />
        We may need to share your personal information in the following situations:<br />
        Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.<br />
        Offer Wall. Our application&#40;s&#41; may display a third-party hosted "offer wall." Such an offer wall allows third-party advertisers to offer virtual currency, gifts, or other items to users in return for the acceptance and completion of an advertisement offer. Such an offer wall may appear in our application&#40;s&#41; and be displayed to you based on certain data, such as your geographic area or demographic information. When you click on an offer wall, you will be brought to an external website belonging to other persons and will leave our application&#40;s&#41;. A unique identifier, such as your user ID, will be shared with the offer wall provider in order to prevent fraud and properly credit your account with the relevant reward.<br />
        <br />
        5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?<br />
        <br />
        In Short: We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services.<br />
        <br />
        The Services, including our offer wall, may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us and which may link to other websites, services, or applications. Accordingly, we do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such third-party websites, services, or applications. The inclusion of a link towards a third-party website, service, or application does not imply an endorsement by us. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy notice. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services, or applications that may be linked to or from the Services. You should review the policies of such third parties and contact them directly to respond to your questions.<br />
        <br />
        6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?<br />
        <br />
        In Short: We may use cookies and other tracking technologies to collect and store your information.<br />
        <br />
        We may use cookies and similar tracking technologies &#40;like web beacons and pixels&#41; to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.<br />
        <br />
        7. HOW DO WE HANDLE YOUR SOCIAL LOGINS?<br />
        <br />
        In Short: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.<br />
        <br />
        Our Services offer you the ability to register and log in using your third-party social media account details &#40;like your Facebook or Twitter logins&#41;. Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.<br />
        <br />
        We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.<br />
        <br />
        8. HOW LONG DO WE KEEP YOUR INFORMATION?<br />
        <br />
        In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.<br />
        <br />
        We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law &#40;such as tax, accounting, or other legal requirements&#41;. No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.<br />
        <br />
        When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible &#40;for example, because your personal information has been stored in backup archives&#41;, then we will securely store your personal information and isolate it from any further processing until deletion is possible.<br />
        <br />
        9. HOW DO WE KEEP YOUR INFORMATION SAFE?<br />
        <br />
        In Short: We aim to protect your personal information through a system of organizational and technical security measures.<br />
        <br />
        We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.<br />
        <br />
        10. DO WE COLLECT INFORMATION FROM MINORS?<br />
        <br />
        In Short: We do not knowingly collect data from or market to children under 18 years of age.<br />
        <br />
        We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at support@qwzya.com.<br />
        <br />
        11. WHAT ARE YOUR PRIVACY RIGHTS?<br />
        <br />
        In Short: In some regions, such as the European Economic Area &#40;EEA&#41;, United Kingdom &#40;UK&#41;, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.<br />
        <br />
        In some regions &#40;like the EEA, UK, and Canada&#41;, you have certain rights under applicable data protection laws. These may include the right &#40;i&#41; to request access and obtain a copy of your personal information, &#40;ii&#41; to request rectification or erasure; &#40;iii&#41; to restrict the processing of your personal information; and &#40;iv&#41; if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.<br />
        <br />
        We will consider and act upon any request in accordance with applicable data protection laws.<br />
        If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm.<br />
        <br />
        If you are located in Switzerland, the contact details for the data protection authorities are available here: https://www.edoeb.admin.ch/edoeb/en/home.html.<br />
        <br />
        Withdrawing your consent: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.<br />
        <br />
        However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.<br />
        <br />
        Opting out of marketing and promotional communications: You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.<br />
        <br />
        Account Information<br />
        <br />
        If you would at any time like to review or change the information in your account or terminate your account, you can:<br />
        Contact us using the contact information provided.<br />
        Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.<br />
        <br />
        Cookies and similar technologies: Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. To opt out of interest-based advertising by advertisers on our Services visit http://www.aboutads.info/choices/.<br />
        <br />
        If you have questions or comments about your privacy rights, you may email us at support@qwzya.com.<br />
        <br />
        12. CONTROLS FOR DO-NOT-TRACK FEATURES<br />
        <br />
        Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track &#40;"DNT"&#41; feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.<br />
        <br />
        13. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?<br />
        <br />
        In Short: Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.<br />
        <br />
        California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information &#40;if any&#41; we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.<br />
        <br />
        If you are under 18 years of age, reside in California, and have a registered account with Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems &#40;e.g., backups, etc.&#41;.<br />
        <br />
        CCPA Privacy Notice<br />
        <br />
        The California Code of Regulations defines a "resident" as:<br />
        <br />
        &#40;1&#41; every individual who is in the State of California for other than a temporary or transitory purpose and<br />
        &#40;2&#41; every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose<br />
        <br />
        All other individuals are defined as "non-residents."<br />
        <br />
        If this definition of "resident" applies to you, we must adhere to certain rights and obligations regarding your personal information.<br />
        <br />
        What categories of personal information do we collect?<br />
        <br />
        We have collected the following categories of personal information in the past twelve &#40;12&#41; months:<br />
        <br />
        Category	Examples	Collected<br />
        A. Identifiers<br />
        Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name<br />
        <br />
        NO<br />
        <br />
        B. Personal information categories listed in the California Customer Records statute<br />
        Name, contact information, education, employment, employment history, and financial information<br />
        <br />
        NO<br />
        <br />
        C. Protected classification characteristics under California or federal law<br />
        Gender and date of birth<br />
        <br />
        NO<br />
        <br />
        D. Commercial information<br />
        Transaction information, purchase history, financial details, and payment information<br />
        <br />
        NO<br />
        <br />
        E. Biometric information<br />
        Fingerprints and voiceprints<br />
        <br />
        NO<br />
        <br />
        F. Internet or other similar network activity<br />
        Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements<br />
        <br />
        YES<br />
        <br />
        G. Geolocation data<br />
        Device location<br />
        <br />
        YES<br />
        <br />
        H. Audio, electronic, visual, thermal, olfactory, or similar information<br />
        Images and audio, video or call recordings created in connection with our business activities<br />
        <br />
        NO<br />
        <br />
        I. Professional or employment-related information<br />
        Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us<br />
        <br />
        NO<br />
        <br />
        J. Education Information<br />
        Student records and directory information<br />
        <br />
        NO<br />
        <br />
        K. Inferences drawn from other personal information<br />
        Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics<br />
        <br />
        YES<br />
        <br />
        L. Sensitive Personal Information		<br />
        NO<br />
        <br />
        <br />
        We will use and retain the collected personal information as needed to provide the Services or for:<br />
        Category F - As long as the user has an account with us<br />
        Category G - As long as the user has an account with us<br />
        Category K - As long as the user has an account with us<br />
        We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:<br />
        Receiving help through our customer support channels;<br />
        Participation in customer surveys or contests; and<br />
        Facilitation in the delivery of our Services and to respond to your inquiries.<br />
        How do we use and share your personal information?<br />
        <br />
        More information about our data collection and sharing practices can be found in this privacy notice.<br />
        <br />
        You may contact us by email at support@qwzya.com, or by referring to the contact details at the bottom of this document.<br />
        <br />
        If you are using an authorized agent to exercise your right to opt out we may deny a request if the authorized agent does not submit proof that they have been validly authorized to act on your behalf.<br />
        <br />
        Will your information be shared with anyone else?<br />
        <br />
        We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Each service provider is a for-profit entity that processes the information on our behalf, following the same strict privacy protection obligations mandated by the CCPA.<br />
        <br />
        We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be "selling" of your personal information.<br />
        <br />
        Qwzya Entertainment & Education has not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve &#40;12&#41; months. Qwzya Entertainment & Education will not sell or share personal information in the future belonging to website visitors, users, and other consumers.<br />
        <br />
        Your rights with respect to your personal data<br />
        <br />
        Right to request deletion of the data — Request to delete<br />
        <br />
        You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as &#40;but not limited to&#41; the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any processing that may be required to protect against illegal activities.<br />
        <br />
        Right to be informed — Request to know<br />
        <br />
        Depending on the circumstances, you have a right to know:<br />
        whether we collect and use your personal information;<br />
        the categories of personal information that we collect;<br />
        the purposes for which the collected personal information is used;<br />
        whether we sell or share personal information to third parties;<br />
        the categories of personal information that we sold, shared, or disclosed for a business purpose;<br />
        the categories of third parties to whom the personal information was sold, shared, or disclosed for a business purpose;<br />
        the business or commercial purpose for collecting, selling, or sharing personal information; and<br />
        the specific pieces of personal information we collected about you.<br />
        In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.<br />
        <br />
        Right to Non-Discrimination for the Exercise of a Consumer’s Privacy Rights<br />
        <br />
        We will not discriminate against you if you exercise your privacy rights.<br />
        <br />
        Right to Limit Use and Disclosure of Sensitive Personal Information<br />
        <br />
        We do not process consumer's sensitive personal information.<br />
        <br />
        Verification process<br />
        <br />
        Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method &#40;e.g., phone or email&#41; that you have previously provided to us. We may also use other verification methods as the circumstances dictate.<br />
        <br />
        We will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such additionally provided information as soon as we finish verifying you.<br />
        <br />
        Other privacy rights<br />
        You may object to the processing of your personal information.<br />
        You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the information.<br />
        You can designate an authorized agent to make a request under the CCPA on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with the CCPA.<br />
        You may request to opt out from future selling or sharing of your personal information to third parties. Upon receiving an opt-out request, we will act upon the request as soon as feasibly possible, but no later than fifteen &#40;15&#41; days from the date of the request submission.<br />
        To exercise these rights, you can contact us by email at support@qwzya.com, or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you.<br />
        <br />
        14. DO WE MAKE UPDATES TO THIS NOTICE?<br />
        <br />
        In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.<br />
        <br />
        We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.<br />
        <br />
        15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?<br />
        <br />
        If you have questions or comments about this notice, you may email us at support@qwzya.com or by post to:<br />
        <br />
        Qwzya Entertainment & Education<br />
        __________<br />
        Bangkok, Bangkok 10250<br />
        Thailand<br />
        <br />
        16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?<br />
        <br />
        You have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please visit: http://www.qwzya.com/privacy.<br />
        This privacy policy was created using Termly's Privacy Policy Generator.
        </div>
      </div>
      }

      {viewGame && 
        <>
          { gameStarted ? <>
      <div>
      <TriviaGame
          categoryId={selectedCategoryId}
          categoryName={selectedCategoryName}
          difficulty={difficulty}
        />
      </div>
        
        <a className="mt-4 btn btn-tertiary" onClick={() => {
          setGameStarted(false);
          setSelectedCategoryName('');
          setSelectedCategoryId(9);
        }}>

          ↺ Restart</a>
        </> : 
        <><strong>Pick a game category and difficulty to start!</strong>
        <br/>
        <div className='container pt-3'>

            <Form.Group controlId="formBasicSelect" className='m-auto'>
              <Form.Select
                className='w-50 m-auto mb-4 fw-bold text-center'
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.currentTarget.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Select>
            </Form.Group>

          {loading ? <div>loading categories...</div> : 
            <>
              {sliceIntoChunks(categories.trivia_categories, 4).map(chunk => 
                <div className='grid row'>
                  {chunk.map(category => 
                    <div className="col-6 col-md-3 pb-4">
                     
                      <button
                      onClick={() => {setGameStarted(true); setSelectedCategoryId(category.id); setSelectedCategoryName(category.name)}}
                      className='text-white fs-4 btn w-100 rounded d-flex align-items-center justify-content-center' style={{backgroundSize: 'cover', minHeight: '200px', backgroundImage: `url(/bgs/${
                        category.name.toString().replace('Entertainment: ', '').replace('Science: ', '').replaceAll(' ', '').toLowerCase()
                      }.jpg)`}}
                      
                      ><strong>
{category.name
                          .replace('Entertainment: ', '')
                          .replace('Science: ', '')
                        }
                      </strong>
                        
                      </button>
                      
                    </div>
                  )}
                </div>  
              )}
            
            </>
          }

           
          
        </div>


        
        </>
      }
        </>
      }
      

      {/* Footer */}
      <footer className='mt-4'>
        <small>
          &copy; {date.getFullYear()} Qwzya Entertainment & Education
          |&nbsp;
          {/* <a onClick={() => setViewAbout(true)}>About</a> |  */}
          <a href="#" onClick={
            () => {setViewPrivacy(true);setViewAbout(false);setViewGame(false);window.scrollTo(0, 0);}
          }>Privacy</a>
        </small>
      </footer>
    </div>
  )
}

export default App;
