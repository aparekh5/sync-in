import React, {useEffect, useState} from 'react'
import './HomePage.css'
import ReactPlayer from 'react-player';
import FAQ from '../FAQ/FAQ'
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import MailIcon from '@material-ui/icons/Mail';
import GitHubIcon from '@material-ui/icons/GitHub';
import { blue } from '@material-ui/core/colors';

export default function HomePage() {
    const [width, setWidth] = useState('200px');
    const [height, setHeight] = useState('200px');

    const systemRequirementsQuestions = [
            {
                question: 'Which browsers and devices are compatible with Sync In',
                answer: 'Sync In is compatible with Google Chrome, Opera browsers, Safari, Mozilla Firefox on laptops and desktop computers. For mobile phones Sync In works properly only on Google Chrome.'
            },
            {
                question: 'What is the limit on the number of people who can join a Sync In party at once ?',
                answer: 'Up to 40 people can participate in the same Sync In Party.'
            },
            {
                question: 'Is Sync In free ?',
                answer: 'Sync In is 100% free.'
            }
        ];

    const hostingJoiningPartyQuestions = [
            {
                question: 'How do I host a Sync In party?',
                answer: 'Copy the URL of the video you wish to see. Go to syncin.app/host paste your link and enter you name. Click Host and you should be good to go!'
            },
            {
                question: 'How do I invite people to my Sync In party',
                answer: 'Click on the \'Copy Invite URL\' button. Share the link with your friends. Your friends can visit the link and join your party.'
            }
        ];

    const privacySecurityQuestions = [
            {
                question: 'Is Sync In safe ?',
                answer: 'Sync In uses end to end encryption and we do not store any of your account details or passwords.',
                fund: false,
            },
            {
                question: 'Is my chat history saved ?',
                answer: 'None of your chat history is saved on our servers.',
                fund: false
            },
            {
                question: 'How does Sync In make money?',
                answer: 'We rely on donations. Please consider donating to Sync In via PayPal',
                fund : true
            }
        ];

    const resize = () => {
        if (window.innerWidth < 875) {
            setWidth('150px');
            setHeight('150px')
        }
        
    }
    
    useEffect(() => {
        window.addEventListener('resize', resize)
        resize();
    }, []);

    return (
        <div>
            <div className="intro">
                <div className="text-description">
                    <div className="heading">
                        A new way to watch videos online
                    </div>
                    <div className="content-description">
                        Sync In is a new way to watch Videos with your friends online. Sync In synchronizes video playback and adds group chat and voice chat to your favorite Videos.
                    </div>
                </div>
                <div className="sample-video">
                    <div className="vid">
                        {//https://www.youtube.com/watch?v=ERwySItq9MA
                        }
                        <ReactPlayer width='100%' height='100%' loop playing={true} controls={false} url={require('./Sync In for web.mp4')}/>
                    </div>
                </div>
            </div>
            <div className="supported-websites">
                <div className="left-icons">
                    <a href="http://www.youtube.com" rel='nofollow' className='icon-link' target='_blank'>
                        <img src="https://img.icons8.com/color/240/000000/youtube-squared.png" alt='Youtube Logo' width={width} height={height} />
                    </a>
                    <a href="http://www.soundcloud.com" rel='nofollow' className='icon-link' target='_blank'>
                        <img src="https://img.icons8.com/color/240/000000/soundcloud.png" alt='SoundCloud Logo' width={width} height={height}/>
                    </a>
                </div>
                <div className="middle-description">
                    Sync In currently Supports Youtube, SoundCloud, Vimeo, Twitch
                </div>
                <div className="right-icons">
                    <a href="http://www.twitch.tv" rel='nofollow' className='icon-link' target='_blank'>
                        <img src="https://img.icons8.com/fluent/240/000000/twitch.png" alt='Twitch Logo' width={width} height={height}/>
                    </a>
                    <a href="http://www.vimeo.com" rel='nofollow' className='icon-link' target='_blank'>
                    <img src="https://img.icons8.com/plasticine/200/000000/vimeo.png" alt='Vimeo Logo' width={width} height={height} />
                    </a>
                </div>
            </div>
            <div className="support">
                <div className="sys-requirements">
                    <div className="heading-faq">
                        <div>System Requirements</div>  
                    </div>
                    <div className="questions">
                        {systemRequirementsQuestions.map((question, num) => (
                            <div  id={num} className='question'>
                                <FAQ question={question.question} answer={question.answer}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="privacy-requirements">
                    <div className="heading-faq">
                        <div>Privacy & Security</div>
                    </div>
                    <div className="questions">
                        {privacySecurityQuestions.map((question, num) => (
                            <div  id={num} className='question'>
                                <FAQ question={question.question} answer={question.answer}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="using-requirements">
                    <div className="heading-faq">
                        <div>Using Sync In</div>
                    </div>
                    <div className="questions">
                        {hostingJoiningPartyQuestions.map((question, num) => (
                            <div  id={num} className='question'>
                                <FAQ question={question.question} answer={question.answer} fund ={question.fund}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="creator-desc">
                <div className="image">
                    <img className='img' src={require('./facePic.png')} alt="Aryaman Parekh"/>
                    <div className="icons">
                            <a href="mailto:aryamanparekh12@gmail.com" target='_blank'>
                            <MailIcon className='media-icon' fontSize='large' style={{ color: blue[50] }} />
                            </a>
                            <a href="https://www.linkedin.com/in/aparekh5/"  target='_blank'>
                            <LinkedInIcon className='media-icon' fontSize='large' style={{ color: blue[50] }} />
                            </a>
                            <a  target='_blank' href="https://github.com/aparekh5">
                            <GitHubIcon className='media-icon' fontSize='large' style={{ color: blue[50] }} />
                            </a>
                    </div>
                </div>
                <div className="personal-info">
                        <div className="name">
                            Aryaman Parekh
                        </div>
                        <div className="hr">
                        <hr/>
                        </div>
                        <div className="personal-description">
                            Computer Science Student at the University of Illinois at Urbana Champaign
                        </div>
                </div>
            </div>
        </div>
    )
}
