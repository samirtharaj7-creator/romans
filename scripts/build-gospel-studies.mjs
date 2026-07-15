import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = 'romans-mobile-inline-notes-68';
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@400;500;600&display=swap';

const stage = (id, phase, reference, title, anchor, excerptVerses, brief, icon, tone) => ({
  id,
  phase,
  reference,
  title,
  anchor,
  excerptVerses,
  brief,
  icon,
  tone,
});

const studies = [
  {
    slug: 'gospel-unfolded',
    title: 'The Gospel Unfolded',
    passage: 'Romans 1-16',
    summary: 'Follow Paul\'s whole gospel argument from humanity\'s need to a worshiping, united, and missionary people.',
    introduction: 'Romans moves with purpose. Paul begins with the gospel promised in Scripture, exposes the world\'s need, announces God\'s righteousness in Christ, and follows grace into new life, mercy, fellowship, and mission.',
    icon: 'book-open',
    stages: [
      stage('gospel-thesis', 'The Gospel Revealed', 'Romans 1:1-17', 'The Gospel Promised and Revealed', '1:16', ['1:16', '1:17'], 'The letter opens with good news centered in God\'s Son and states its governing claim: the gospel reveals God\'s saving righteousness from faith to faith.', 'book-open', 'gold'),
      stage('humanity-under-sin', 'The World in Need', 'Romans 1:18-3:20', 'Humanity Under Sin', '3:9', ['3:9', '3:10'], 'Gentile rebellion and Jewish presumption meet under one verdict. Every mouth is stopped, and no community can turn privilege or morality into righteousness.', 'circle-alert', 'crimson'),
      stage('righteousness-through-faith', 'Grace in Christ', 'Romans 3:21-4:25', 'Righteousness Through Faith', '3:24', ['3:23', '3:24'], 'God acts where sinners cannot. Justification is a gift grounded in Christ\'s redemption, received by faith, and witnessed beforehand in Abraham.', 'scale', 'gold'),
      stage('peace-and-new-humanity', 'Grace in Christ', 'Romans 5:1-21', 'Peace and a New Humanity', '5:1', ['5:1', '5:2'], 'Justification opens into peace, hope, and reconciliation. Adam\'s ruin is answered by Christ\'s obedient gift and the reign of grace.', 'sunrise', 'gold'),
      stage('freedom-from-sin', 'Life Made New', 'Romans 6:1-23', 'Dead to Sin, Alive to God', '6:4', ['6:3', '6:4'], 'Grace does not preserve sin\'s dominion. Union with Christ joins believers to His death and resurrection so they may walk in newness of life.', 'refresh-cw', 'sage'),
      stage('law-and-spirit', 'Life Made New', 'Romans 7:1-8:39', 'From the Cry of the Flesh to Life in the Spirit', '8:2', ['8:1', '8:2'], 'The law exposes sin but cannot liberate the captive self. Deliverance comes through Christ and the Spirit, ending in adoption, hope, and inseparable love.', 'wind', 'sage'),
      stage('israel-and-nations', 'Mercy for All', 'Romans 9:1-11:36', 'Israel, the Nations, and the Mercy of God', '11:32', ['11:32', '11:33'], 'Paul faces Israel\'s unbelief without surrendering God\'s faithfulness. Jews and Gentiles alike stand only by mercy, never by presumption.', 'git-branch', 'copper'),
      stage('transformed-community', 'The Gospel Embodied', 'Romans 12:1-15:13', 'Living Sacrifice and Transformed Community', '12:1', ['12:1', '12:2'], 'The mercies of God take bodily and communal form: renewed minds, humble gifts, genuine love, responsible freedom, and patient welcome.', 'heart', 'sage'),
      stage('mission-and-doxology', 'The Gospel Embodied', 'Romans 15:14-16:27', 'Mission, Fellowship, and Doxology', '15:16', ['15:15', '15:16'], 'Romans closes with mission among the nations, a network of gospel coworkers, vigilance for unity, and praise to the God who establishes His people.', 'send', 'copper'),
    ],
  },
  {
    slug: 'righteousness-by-faith',
    title: 'Righteousness by Faith',
    passage: 'Romans 1:16-5:11',
    summary: 'Trace the movement from revealed need to justification, Abraham\'s faith, peace with God, and hope in His glory.',
    introduction: 'Paul does not present righteousness by faith as a religious shortcut. He first removes every false refuge, then directs sinners to God\'s gracious action in Christ and the faith that receives His gift without boasting.',
    icon: 'scale',
    stages: [
      stage('gospel-power', 'The Thesis', 'Romans 1:16-17', 'The Gospel Is God\'s Power', '1:16', ['1:16', '1:17'], 'Paul\'s thesis joins salvation, revelation, righteousness, and faith. The gospel is powerful because God acts through it to save.', 'book-open', 'gold'),
      stage('revealed-wrath', 'Need Exposed', 'Romans 1:18-32', 'Wrath Against Suppressed Truth', '1:18', ['1:18', '1:19'], 'Divine wrath answers humanity\'s refusal of known truth. Idolatry disorders worship, desire, judgment, and the shared life of society.', 'circle-alert', 'crimson'),
      stage('impartial-judgment', 'Need Exposed', 'Romans 2:1-29', 'The Impartial Judgment of God', '2:6', ['2:5', '2:6'], 'Moral knowledge cannot shelter the person who judges others while resisting truth. God\'s judgment reaches conduct, motives, and the heart.', 'scale', 'crimson'),
      stage('universal-guilt', 'Need Exposed', 'Romans 3:1-20', 'Every Mouth Stopped', '3:19', ['3:19', '3:20'], 'Scripture gathers the human family under sin so that privilege, law possession, and human works cannot become grounds for boasting before God.', 'circle-alert', 'crimson'),
      stage('righteousness-in-christ', 'Grace Given', 'Romans 3:21-26', 'God\'s Righteousness in Christ', '3:24', ['3:23', '3:24'], 'Apart from human achievement, God reveals a righteousness witnessed by Scripture and grounded in Christ\'s redemptive death.', 'sunrise', 'gold'),
      stage('boasting-excluded', 'Grace Given', 'Romans 3:27-31', 'Boasting Excluded, the Law Established', '3:27', ['3:27', '3:28'], 'Faith leaves no room for self-congratulation. The one God justifies Jews and Gentiles through faith and establishes the law in its proper witness.', 'scale', 'gold'),
      stage('abrahams-faith', 'Promise Received', 'Romans 4:1-25', 'Abraham Believed God', '4:3', ['4:2', '4:3'], 'Abraham becomes the father of all who believe because righteousness was counted to him before circumcision and apart from works as merit.', 'sprout', 'copper'),
      stage('peace-and-reconciliation', 'Promise Received', 'Romans 5:1-11', 'Peace, Hope, and Reconciliation', '5:1', ['5:1', '5:2'], 'The justified now stand in grace. Tribulation cannot cancel hope because God\'s love has been demonstrated in Christ\'s death for His enemies.', 'sunrise', 'sage'),
    ],
  },
  {
    slug: 'adam-and-christ',
    title: 'Adam, Christ, and the New Humanity',
    passage: 'Romans 5:12-6:23',
    summary: 'See two humanities, two reigns, and two ways of life: death in Adam and grace, righteousness, and new obedience in Christ.',
    introduction: 'Paul widens the gospel story from individual guilt to two representative heads. Adam\'s trespass opens the reign of sin and death; Christ\'s obedience creates a new humanity whose members share His life.',
    icon: 'refresh-cw',
    stages: [
      stage('sin-and-death', 'Two Humanities', 'Romans 5:12-14', 'Sin and Death Enter Through One Man', '5:12', ['5:12', '5:14'], 'Adam\'s act opens a history in which sin reigns and death reaches all. Human beings confirm that solidarity through sins of their own.', 'circle-alert', 'crimson'),
      stage('gift-exceeds-trespass', 'Two Humanities', 'Romans 5:15-17', 'The Gift Exceeds the Trespass', '5:15', ['5:15', '5:17'], 'Paul refuses to place Adam and Christ on equal scales. The trespass devastates, but grace and the gift of righteousness abound more.', 'scale', 'gold'),
      stage('condemnation-and-life', 'Two Humanities', 'Romans 5:18-19', 'Condemnation and Justification of Life', '5:18', ['5:18', '5:19'], 'The disobedience of one and the obedience of One establish opposing realms. Christ answers Adam at the representative root of humanity\'s ruin.', 'users', 'gold'),
      stage('superabounding-grace', 'The Reign of Grace', 'Romans 5:20-21', 'Where Sin Abounded, Grace Superabounded', '5:20', ['5:20', '5:21'], 'The law makes trespass visible, but it does not have the final word. Grace reigns through righteousness unto eternal life in Jesus Christ.', 'sunrise', 'gold'),
      stage('baptized-into-christ', 'United With Christ', 'Romans 6:1-4', 'Buried and Raised With Christ', '6:4', ['6:3', '6:4'], 'Baptism declares participation in Christ\'s death and resurrection. Grace therefore introduces a new walk rather than permission to remain unchanged.', 'waves', 'sage'),
      stage('union-with-resurrection', 'United With Christ', 'Romans 6:5-11', 'The Old Humanity Crucified', '6:6', ['6:5', '6:6'], 'Union with Christ breaks sin\'s claim to mastery. Believers reckon themselves dead to sin and alive to God because Christ now lives beyond death.', 'refresh-cw', 'sage'),
      stage('yielding-to-god', 'A New Allegiance', 'Romans 6:12-14', 'Present Yourselves to God', '6:13', ['6:12', '6:13'], 'The body becomes an arena of worship. Grace trains believers to refuse sin\'s rule and offer every faculty as an instrument of righteousness.', 'heart', 'sage'),
      stage('two-slaveries', 'A New Allegiance', 'Romans 6:15-20', 'Two Masters, Two Kinds of Service', '6:16', ['6:16', '6:17'], 'Freedom is never moral vacancy. The gospel transfers allegiance from sin\'s slavery to obedience from the heart and service to righteousness.', 'git-branch', 'copper'),
      stage('wages-and-gift', 'A New Allegiance', 'Romans 6:21-23', 'The Wages of Sin and the Gift of God', '6:23', ['6:22', '6:23'], 'Paul closes the contrast with two outcomes. Sin pays death as wages; God gives eternal life freely in Jesus Christ our Lord.', 'gift', 'gold'),
    ],
  },
  {
    slug: 'law-flesh-and-spirit',
    title: 'Law, Flesh, and Spirit',
    passage: 'Romans 7-8',
    summary: 'Move from the law\'s faithful witness and the captive self\'s cry to the Spirit\'s freedom, adoption, hope, and assurance.',
    introduction: 'Romans 7-8 distinguishes what is holy from what is powerless. God\'s law names sin truthfully, yet liberation comes only through Jesus Christ and the indwelling Spirit who forms the life the law describes.',
    icon: 'wind',
    stages: [
      stage('fruit-to-god', 'The Law and the Old Life', 'Romans 7:1-6', 'Freed to Bear Fruit for God', '7:4', ['7:4', '7:6'], 'Believers die to the old realm through Christ so they may belong to the risen Lord and serve in the newness of the Spirit.', 'sprout', 'sage'),
      stage('law-reveals-sin', 'The Law and the Old Life', 'Romans 7:7-13', 'The Law Reveals Sin', '7:7', ['7:7', '7:12'], 'The commandment is holy and good. Sin exploits the commandment, exposes covetous desire, and turns what is good into an occasion for death.', 'scale', 'crimson'),
      stage('divided-struggle', 'The Captive Self', 'Romans 7:14-23', 'The Divided Struggle Under Sin', '7:19', ['7:18', '7:19'], 'Knowledge and desire cannot free the captive will. Paul portrays the anguish of recognizing the good while another power works in the members.', 'git-branch', 'crimson'),
      stage('cry-for-deliverance', 'The Captive Self', 'Romans 7:24-25', 'Who Shall Deliver Me?', '7:24', ['7:24', '7:25'], 'The chapter\'s cry does not end in introspection. Thanksgiving names Jesus Christ as the only deliverer from the body of death.', 'circle-alert', 'gold'),
      stage('no-condemnation', 'Life in the Spirit', 'Romans 8:1-4', 'No Condemnation in Christ', '8:1', ['8:1', '8:2'], 'The Spirit\'s law of life frees those in Christ from sin and death. God acts in His Son so the law\'s righteous requirement may be fulfilled.', 'sunrise', 'gold'),
      stage('spirit-minded-life', 'Life in the Spirit', 'Romans 8:5-13', 'The Mind of the Spirit', '8:6', ['8:5', '8:6'], 'Flesh and Spirit describe opposed orientations. The indwelling Spirit gives life and empowers believers to put sinful deeds to death.', 'wind', 'sage'),
      stage('adoption', 'Children and Heirs', 'Romans 8:14-17', 'Adoption and the Cry of Abba', '8:15', ['8:14', '8:15'], 'Those led by the Spirit are not returned to fear. They receive adoption, cry to the Father, and share Christ\'s inheritance and path.', 'users', 'sage'),
      stage('creation-groans', 'Children and Heirs', 'Romans 8:18-27', 'Creation and the Spirit Groan', '8:22', ['8:22', '8:23'], 'Present suffering belongs to a creation awaiting liberation. Hope waits, and the Spirit intercedes within weakness according to God\'s will.', 'wind', 'sage'),
      stage('conformed-to-christ', 'Purpose and Assurance', 'Romans 8:28-30', 'Conformed to the Image of the Son', '8:29', ['8:28', '8:29'], 'God\'s purpose is not merely relief from difficulty but a people shaped into Christ\'s likeness and brought toward final glory.', 'refresh-cw', 'copper'),
      stage('inseparable-love', 'Purpose and Assurance', 'Romans 8:31-39', 'Nothing Can Separate Us', '8:38', ['8:38', '8:39'], 'The chapter closes with confidence grounded in God\'s giving of His Son. No created power can sever believers from His love in Christ.', 'heart', 'gold'),
    ],
  },
  {
    slug: 'israel-and-the-nations',
    title: 'Israel and the Nations',
    passage: 'Romans 9-11',
    summary: 'Follow Paul\'s sorrow, the promise, the remnant, the olive tree, and the mercy that humbles both Israel and the nations.',
    introduction: 'Paul addresses Israel with tears rather than abstraction. These chapters defend God\'s faithfulness, expose every form of presumption, and place Jewish and Gentile hope within the same mercy revealed in Christ.',
    icon: 'git-branch',
    stages: [
      stage('pauls-sorrow', 'The Question of Israel', 'Romans 9:1-5', 'Sorrow and Israel\'s Privileges', '9:2', ['9:1', '9:2'], 'Paul begins with grief for his own people and honors the gifts entrusted to Israel, culminating in the Messiah according to the flesh.', 'heart', 'copper'),
      stage('children-of-promise', 'Promise and Mercy', 'Romans 9:6-13', 'The Word of God Has Not Failed', '9:6', ['9:6', '9:8'], 'God\'s promise has always advanced by divine calling rather than mere physical descent. Covenant privilege cannot be reduced to ancestry alone.', 'sprout', 'gold'),
      stage('divine-mercy', 'Promise and Mercy', 'Romans 9:14-29', 'Mercy Belongs to God', '9:16', ['9:15', '9:16'], 'God is not indebted to human willing or status. His freedom is the freedom to show mercy and preserve a people who could not save themselves.', 'gift', 'gold'),
      stage('stumbling-and-faith', 'Righteousness Near', 'Romans 9:30-10:4', 'Stumbling Over Christ', '9:32', ['9:31', '9:32'], 'The nations receive righteousness by faith while Israel stumbles through pursuing the law as a ground of achievement rather than coming to Christ.', 'scale', 'crimson'),
      stage('word-made-near', 'Righteousness Near', 'Romans 10:5-21', 'The Word of Faith Is Near', '10:9', ['10:8', '10:9'], 'The gospel does not demand an impossible ascent. Christ has come and risen; the near word calls for heart-faith, confession, hearing, and mission.', 'send', 'sage'),
      stage('remnant-by-grace', 'A Remnant and a Welcome', 'Romans 11:1-10', 'God Has Not Cast Away His People', '11:1', ['11:1', '11:5'], 'Paul himself and the remnant testify that rejection is neither total nor final. Grace preserves a people without leaving room for works as merit.', 'users', 'gold'),
      stage('gentile-inclusion', 'A Remnant and a Welcome', 'Romans 11:11-16', 'Salvation Comes to the Nations', '11:11', ['11:11', '11:12'], 'Israel\'s stumbling becomes an occasion for Gentile salvation, yet Gentile inclusion is meant to awaken hope rather than celebrate another\'s fall.', 'send', 'copper'),
      stage('olive-tree-warning', 'One Olive Tree', 'Romans 11:17-24', 'Do Not Boast Against the Branches', '11:20', ['11:19', '11:20'], 'Gentile believers are grafted into a covenant root they did not create. They stand by faith and must exchange superiority for reverent humility.', 'git-branch', 'sage'),
      stage('mystery-and-mercy', 'One Olive Tree', 'Romans 11:25-32', 'The Mystery of Mercy', '11:32', ['11:30', '11:32'], 'Partial hardening, the fullness of the nations, and Israel\'s hope all serve a conclusion in which every group depends on divine mercy.', 'book-open', 'copper'),
      stage('wisdom-doxology', 'One Olive Tree', 'Romans 11:33-36', 'The Depth of the Wisdom of God', '11:33', ['11:33', '11:36'], 'Paul ends the argument in worship. God is the source, sustainer, and goal of the saving history that human pride cannot master.', 'sunrise', 'gold'),
    ],
  },
  {
    slug: 'a-living-sacrifice',
    title: 'A Living Sacrifice',
    passage: 'Romans 12-16',
    summary: 'Watch the gospel become embodied worship through renewed minds, humble gifts, genuine love, welcome, unity, and mission.',
    introduction: 'The practical chapters of Romans are not an appendix to grace. They show the shape mercy takes in bodies, households, congregations, civic life, disputed questions, hospitality, and the shared mission of the church.',
    icon: 'heart',
    stages: [
      stage('transformed-worship', 'Mercy Embodied', 'Romans 12:1-2', 'Living Sacrifice and a Renewed Mind', '12:1', ['12:1', '12:2'], 'Because God has shown mercy, believers offer their whole embodied lives to Him and learn to discern His will through transformed thinking.', 'refresh-cw', 'sage'),
      stage('one-body-and-gifts', 'Mercy Embodied', 'Romans 12:3-8', 'One Body With Different Gifts', '12:5', ['12:4', '12:5'], 'Grace dismantles inflated self-estimates and forms a body whose varied gifts are exercised faithfully for the good of others.', 'users', 'sage'),
      stage('genuine-love', 'Love Without Pretence', 'Romans 12:9-21', 'Overcome Evil With Good', '12:21', ['12:20', '12:21'], 'Gospel love is discerning, hospitable, patient, peaceable, and active toward enemies. It refuses to answer evil on evil\'s own terms.', 'heart', 'copper'),
      stage('civil-order-and-love', 'Love Without Pretence', 'Romans 13:1-10', 'Responsibility, Neighbor Love, and the Law', '13:10', ['13:8', '13:10'], 'Paul joins responsible public conduct to the enduring debt of love. Love does no harm and therefore fulfills the law\'s relational intent.', 'scale', 'copper'),
      stage('wakefulness', 'Wakeful Discipleship', 'Romans 13:11-14', 'Awake and Put On Christ', '13:12', ['13:11', '13:12'], 'The nearness of salvation calls believers out of spiritual sleep. Christian ethics are lived in the light of the coming day.', 'sunrise', 'gold'),
      stage('conscience-and-welcome', 'A Welcoming Community', 'Romans 14:1-23', 'Welcome Without Quarreling', '14:13', ['14:12', '14:13'], 'In disputed matters, each believer answers to the Lord. Love refuses contempt, judgmentalism, and the use of liberty that wounds another conscience.', 'users', 'sage'),
      stage('bearing-with-the-weak', 'A Welcoming Community', 'Romans 15:1-13', 'Receive One Another as Christ Received You', '15:7', ['15:5', '15:7'], 'The strong bear rather than please themselves. Christ\'s welcome creates patient unity and a shared voice of praise among Jews and Gentiles.', 'heart', 'sage'),
      stage('mission-to-the-nations', 'Mission and Fellowship', 'Romans 15:14-33', 'A Priestly Ministry of the Gospel', '15:16', ['15:15', '15:16'], 'Paul understands mission as a grace-given ministry through which the nations become an offering sanctified by the Holy Spirit.', 'send', 'copper'),
      stage('gospel-coworkers', 'Mission and Fellowship', 'Romans 16:1-16', 'A Network of Gospel Coworkers', '16:3', ['16:1', '16:3'], 'The closing greetings reveal that mission is communal. Women and men, households and congregations, labor together in costly service to Christ.', 'users', 'copper'),
      stage('unity-and-doxology', 'Mission and Fellowship', 'Romans 16:17-27', 'Established by the Gospel', '16:25', ['16:25', '16:27'], 'Paul warns against divisive teaching, promises God\'s victory, and entrusts the church to the God who establishes believers through the gospel.', 'book-open', 'gold'),
    ],
  },
];

const studyFallbackReferences = {
  'gospel-unfolded': ['Genesis 15:6', 'Habakkuk 2:4', 'Galatians 3:11', 'Ephesians 2:8-10'],
  'righteousness-by-faith': ['Genesis 15:6', 'Habakkuk 2:4', 'Galatians 3:11', 'Ephesians 2:8-10'],
  'adam-and-christ': ['Genesis 3:17-19', '1 Corinthians 15:21-22', '1 Corinthians 15:45-49', '2 Corinthians 5:17'],
  'law-flesh-and-spirit': ['Exodus 20:1-17', 'Ezekiel 36:26-27', '2 Corinthians 3:17-18', 'Galatians 5:16-25'],
  'israel-and-the-nations': ['Genesis 12:1-3', 'Isaiah 59:20-21', 'Jeremiah 11:16', 'Ephesians 2:11-22'],
  'a-living-sacrifice': ['Matthew 5:43-48', 'John 13:34-35', 'Galatians 5:13-14', 'Philippians 2:1-5'],
};

const iconPaths = {
  'book-open': '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>',
  'circle-alert': '<circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line>',
  scale: '<path d="M12 3v18"></path><path d="m19 8 3 8a5 5 0 0 1-6 0zV7"></path><path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"></path><path d="m5 8 3 8a5 5 0 0 1-6 0zV7"></path><path d="M7 21h10"></path>',
  sunrise: '<path d="M12 2v8"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m8 6 4-4 4 4"></path><path d="M16 18a4 4 0 0 0-8 0"></path>',
  'refresh-cw': '<path d="M21 12a9 9 0 0 0-15-6.7L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path><path d="M16 16h5v5"></path>',
  wind: '<path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2"></path><path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path><path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>',
  'git-branch': '<line x1="6" x2="6" y1="3" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>',
  sprout: '<path d="M7 20h8"></path><path d="M10 20c5.5-2.5.8-6.4 3-10"></path><path d="M9.5 9.4c1.5 1.5 2.6 1.5 4 1-1-3-2-4-5-3 0 1 .1 1.4 1 2Z"></path><path d="M14.1 6c-1.1 1.1-1.1 2.6-.3 3.3 2.7-.3 4.3-1.4 4.3-4.3-1.6-.1-3 .2-4 1Z"></path>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5S12 7 14.5 7 17 5 19.5 5 22 7 22 7"></path><path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11s2.5 2 5 2 2.5-2 5-2 2.5 2 2.5 2"></path><path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17s2.5 2 5 2 2.5-2 5-2 2.5 2 2.5 2"></path>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"></path>',
  menu: '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>',
};

function icon(name, className = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">${iconPaths[name] || iconPaths['book-open']}</svg>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function referenceParts(reference) {
  const match = reference.match(/^(\d+):(\d+)$/);
  if (!match) throw new Error(`Invalid verse reference: ${reference}`);
  return { chapter: Number(match[1]), verse: Number(match[2]) };
}

function trimStudy(raw) {
  const normalized = raw.replace(/\s+/g, ' ').trim();
  const words = normalized.split(' ');
  if (words.length < 150) return normalized;
  const windowText = words.slice(0, Math.min(words.length, 225)).join(' ');
  const candidateEnds = ['. ', '? ', '! ']
    .map((ending) => windowText.lastIndexOf(ending))
    .filter((index) => index > 0);
  const lastEnd = candidateEnds.length ? Math.max(...candidateEnds) + 1 : -1;
  if (lastEnd > 0 && windowText.slice(0, lastEnd).split(/\s+/).length >= 150) {
    return windowText.slice(0, lastEnd).trim();
  }
  return `${words.slice(0, 210).join(' ').replace(/[,:;]$/, '')}.`;
}

async function loadVerseMap() {
  const verseMap = new Map();
  for (let chapter = 1; chapter <= 16; chapter += 1) {
    const filename = path.join(ROOT, 'content', 'romans', `chapter-${String(chapter).padStart(2, '0')}.json`);
    const content = JSON.parse(await fs.readFile(filename, 'utf8'));
    content.verses.forEach((verse) => {
      verseMap.set(verse.verse.replace(/^Romans\s+/, ''), verse);
    });
  }
  return verseMap;
}

function hydrateStudies(verseMap) {
  return studies.map((study) => ({
    ...study,
    stages: study.stages.map((item, index) => {
      const anchorVerse = verseMap.get(item.anchor);
      if (!anchorVerse) throw new Error(`Missing anchor ${item.anchor} for ${study.slug}/${item.id}`);
      const excerpt = item.excerptVerses.map((reference) => {
        const verse = verseMap.get(reference);
        if (!verse) throw new Error(`Missing excerpt ${reference} for ${study.slug}/${item.id}`);
        const { verse: verseNumber } = referenceParts(reference);
        return { reference, verseNumber, text: verse.bibleText };
      });
      const { chapter, verse } = referenceParts(item.anchor);
      const nearbyReferences = [-2, -1, 0, 1, 2]
        .map((offset) => verseMap.get(`${chapter}:${verse + offset}`))
        .filter(Boolean)
        .flatMap((nearbyVerse) => nearbyVerse.crossReferences || []);
      const crossReferences = Array.from(new Set([
        ...anchorVerse.crossReferences,
        ...item.excerptVerses.flatMap((reference) => verseMap.get(reference)?.crossReferences || []),
        ...nearbyReferences,
        ...studyFallbackReferences[study.slug],
      ])).slice(0, 4);
      return {
        ...item,
        number: index + 1,
        excerpt,
        expandedStudy: trimStudy(anchorVerse.commentary.detailedExplanation),
        crossReferences,
        commentaryHref: `/romans/${chapter}/#romans-${chapter}-${verse}`,
      };
    }),
  }));
}

function head(title, description, preloadHero = false) {
  return `  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | Romans Study</title>
    <meta name="description" content="${escapeHtml(description)}">
${preloadHero ? '    <link rel="preload" as="image" href="/assets/romans-hero-engraving-filled.webp?v=3" type="image/webp" fetchpriority="high">\n' : ''}    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="${FONT_HREF}" rel="stylesheet">
    <link rel="stylesheet" href="/_next/static/css/f76b0aea01fab224.css">
    <link rel="stylesheet" href="/global-shell.css?v=compact-strip-1">
    <link rel="stylesheet" href="/romans-illustrated.css?v=${VERSION}" data-romans-illustrated="css">
    <link rel="stylesheet" href="/gospel/gospel.css?v=${VERSION}">
  </head>`;
}

function siteHeader() {
  const links = [
    ['/', 'Home'],
    ['/introduction/', 'Introduction'],
    ['/romans/1/', 'Commentary'],
    ['/gospel/', 'Gospel'],
    ['/articles/', 'Articles'],
    ['/search/', 'Search'],
  ];
  const navLinks = links.map(([href, label]) => `<a class="reader-nav-link${label === 'Gospel' ? ' reader-nav-link-active' : ''}" href="${href}"${label === 'Gospel' ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const menuLinks = links.map(([href, label]) => `<a class="reader-menu-link${label === 'Gospel' ? ' reader-menu-link-active' : ''}" href="${href}"${label === 'Gospel' ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `  <header class="reader-header no-print">
    <a class="reader-brand" aria-label="Romans Study Home" href="/">
      <span class="reader-logo" aria-hidden="true">${icon('book-open', 'h-5 w-5')}</span>
      <span class="reader-brand-text"><span class="reader-brand-strong">Romans Study</span></span>
    </a>
    <nav class="reader-nav" aria-label="Primary navigation">${navLinks}</nav>
    <div class="reader-header-actions">
      <button class="reader-menu-button" type="button" aria-label="Open menu" aria-expanded="false" data-romans-static-menu-button>${icon('menu', 'h-5 w-5')}</button>
    </div>
    <nav class="reader-menu" aria-label="Mobile navigation" data-romans-static-menu hidden>${menuLinks}</nav>
  </header>`;
}

function scriptIncludes() {
  return `  <script src="/gospel/gospel.js?v=${VERSION}"></script>
  <script src="/mbe-unified.js?v=${VERSION}"></script>`;
}

function libraryCard(study, index) {
  return `        <a class="gospel-library-card" href="/gospel/${study.slug}/">
          <span class="gospel-library-card-number">${String(index + 1).padStart(2, '0')}</span>
          <span class="gospel-library-card-icon">${icon(study.icon, 'h-7 w-7')}</span>
          <p>${escapeHtml(study.passage)}</p>
          <h2>${escapeHtml(study.title)}</h2>
          <span>${escapeHtml(study.summary)}</span>
          <strong>Open study <span aria-hidden="true">&rarr;</span></strong>
        </a>`;
}

function renderLibrary(hydratedStudies) {
  return `<!doctype html>
<html lang="en" class="dark" style="color-scheme: dark">
${head('The Gospel in Romans', 'Explore six visual studies tracing the gospel through Romans from humanity\'s need to grace, life in the Spirit, mercy, and mission.', true)}
<body data-romans-static-page="gospel-library">
${siteHeader()}
  <main class="gospel-page gospel-library-page">
    <section class="gospel-library-hero" aria-labelledby="gospel-library-title">
      <div class="gospel-library-hero-copy">
        <p>The Epistle to the Romans</p>
        <h1 id="gospel-library-title">The Gospel in Romans</h1>
        <span>Trace Paul\'s argument through six connected visual studies: from the world\'s need and God\'s righteousness in Christ to life in the Spirit, mercy, worship, and mission.</span>
      </div>
    </section>
    <section class="gospel-library-section" aria-labelledby="gospel-studies-title">
      <div class="gospel-section-heading">
        <div>
          <p>Visual Study Library</p>
          <h2 id="gospel-studies-title">Follow the argument. See the connections.</h2>
        </div>
        <span>Six studies across all sixteen chapters</span>
      </div>
      <div class="gospel-library-grid">
${hydratedStudies.map(libraryCard).join('\n')}
      </div>
    </section>
  </main>
${scriptIncludes()}
</body>
</html>
`;
}

function scriptureExcerpt(excerpt) {
  return excerpt.map((verse) => `<span><sup>${verse.verseNumber}</sup>${escapeHtml(verse.text)}</span>`).join(' ');
}

function stageMarkup(study, item) {
  const stageId = `${study.slug}-${item.id}`;
  const panelId = `${stageId}-study`;
  return `      <article class="gospel-timeline-stage" id="${stageId}" data-gospel-stage data-tone="${item.tone}">
        <div class="gospel-stage-scripture">
          <p>${escapeHtml(item.reference)}</p>
          <h2>${escapeHtml(item.title)}</h2>
          <blockquote>${scriptureExcerpt(item.excerpt)}</blockquote>
        </div>
        <div class="gospel-stage-rail" aria-hidden="true">
          <span>${icon(item.icon, 'h-6 w-6')}</span>
        </div>
        <div class="gospel-stage-explanation">
          <p class="gospel-stage-phase">${escapeHtml(item.phase)}</p>
          <h3>${String(item.number).padStart(2, '0')} &middot; ${escapeHtml(item.title)}</h3>
          <p class="gospel-stage-brief">${escapeHtml(item.brief)}</p>
          <button class="gospel-stage-toggle" type="button" aria-expanded="true" aria-controls="${panelId}" data-gospel-stage-toggle>
            <span>Explore stage</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
          </button>
          <div class="gospel-stage-expanded" id="${panelId}" data-gospel-stage-expanded>
            <p>${escapeHtml(item.expandedStudy)}</p>
            <div class="gospel-stage-references" aria-label="Cross references">
              ${item.crossReferences.map((reference) => `<span>${escapeHtml(reference)}</span>`).join('')}
            </div>
            <a class="gospel-stage-commentary-link" href="${item.commentaryHref}">Open in Commentary <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
      </article>`;
}

function renderStudy(study) {
  const progress = study.stages.map((item) => {
    const stageId = `${study.slug}-${item.id}`;
    return `<a href="#${stageId}" data-gospel-progress-link><span>${String(item.number).padStart(2, '0')}</span><strong>${escapeHtml(item.title)}</strong></a>`;
  }).join('');
  return `<!doctype html>
<html lang="en" class="dark" style="color-scheme: dark">
${head(study.title, study.summary, true)}
<body data-romans-static-page="gospel-study" data-gospel-study="${study.slug}">
${siteHeader()}
  <main class="gospel-page gospel-study-page">
    <section class="gospel-study-hero" aria-labelledby="gospel-study-title">
      <div class="gospel-study-hero-copy">
        <a href="/gospel/">&larr; All Gospel studies</a>
        <p>The Gospel in Romans &middot; ${escapeHtml(study.passage)}</p>
        <h1 id="gospel-study-title">${escapeHtml(study.title)}</h1>
        <span>${escapeHtml(study.introduction)}</span>
      </div>
    </section>
    <nav class="gospel-progress-strip" aria-label="${escapeHtml(study.title)} stages" data-gospel-progress>
      <div>${progress}</div>
    </nav>
    <section class="gospel-timeline" aria-label="${escapeHtml(study.title)} visual timeline">
${study.stages.map((item) => stageMarkup(study, item)).join('\n')}
    </section>
    <section class="gospel-next-studies" aria-labelledby="gospel-next-title">
      <p>Continue Exploring</p>
      <h2 id="gospel-next-title">Return to the whole visual library.</h2>
      <a href="/gospel/">View all six studies <span aria-hidden="true">&rarr;</span></a>
    </section>
  </main>
${scriptIncludes()}
</body>
</html>
`;
}

async function main() {
  const verseMap = await loadVerseMap();
  const hydratedStudies = hydrateStudies(verseMap);
  const gospelRoot = path.join(ROOT, 'gospel');
  await fs.mkdir(gospelRoot, { recursive: true });
  await fs.writeFile(path.join(ROOT, 'data', 'gospel-studies.json'), `${JSON.stringify(hydratedStudies, null, 2)}\n`);
  await fs.writeFile(path.join(gospelRoot, 'index.html'), renderLibrary(hydratedStudies));
  for (const study of hydratedStudies) {
    const studyRoot = path.join(gospelRoot, study.slug);
    await fs.mkdir(studyRoot, { recursive: true });
    await fs.writeFile(path.join(studyRoot, 'index.html'), renderStudy(study));
  }
  const stageCount = hydratedStudies.reduce((total, study) => total + study.stages.length, 0);
  process.stdout.write(`Built ${hydratedStudies.length} Gospel studies with ${stageCount} stages.\n`);
}

await main();
