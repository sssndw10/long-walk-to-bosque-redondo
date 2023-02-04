import { useState } from 'react'
import styled from "styled-components";
import {MdOutlineArrowBackIos, MdOutlineArrowForwardIos,} from 'react-icons/md';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import {BsChevronDoubleDown, BsChevronDoubleUp} from 'react-icons/bs';

const Container = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  border:0px;
  height:83.4vh;
  overflow:hidden;
`

const InnerContainer = styled(motion.div)`
  width:100%;
  height:100%;
  position:absolute;
  top:0px;
  overflow:hidden;
  overflow-x:hidden;
`

const Button = styled.button<{isRight:Boolean}>`
  height:50px;
  width:50px;
  border-radius:25px;
  background-color:${(props)=>props.theme.black.lighter};
  display:flex;
  align-items:center;
  justify-content:center;
  position:absolute;
  right:${(props)=>props.isRight ? 0 : null};
  left:${(props)=>props.isRight ? null : 0};
  padding:0;
  margin: 0px auto;
`

const Image = styled.div<{src:string}>`
  width:90%;
  height:100vh;
  background-size:cover;
  background-position:center center;
  border-radius:50px;
  background-image:url(${(props)=>props.src});
`
const ArrowIndicator = styled(motion.div)<{isBottom:Boolean}>`
  width:100px;
  height:100px;
  position:absolute;
  margin:auto 0px;
  bottom:${(props)=>props.isBottom?'0':null};
  top:${(props)=>props.isBottom?null:'0'};
  display:flex;
  justify-content:center;
`

const InnerInnerContainer = styled(motion.div)`
  width:100%;
  height:100%;
  display:flex;
  justify-content:center;
`

const outerVariants = {
  appear:(reverse:number)=>({
    x: reverse>0 ? window.innerWidth : -window.innerWidth,
   
  }),
  center:{
    x:0,
    
  },
  exit:(reverse:number)=>({
    x:reverse>0 ? -window.innerWidth : window.innerWidth,
    
  }),
}

const innerVariants = {
  up:(given:{location:number, isLeaving:boolean})=>{
    if (given.isLeaving!==undefined){
      return {y:given.location>0 ? -window.innerHeight : window.innerHeight,opacity:0,}
    }else{
      return {y:0,opacity:0,}
    }
  },
  center:{
    y:0,
    opacity:1,
  },
  down:(given:{location:number, isLeaving:boolean})=>{
    console.log(given.isLeaving);
    if (given.isLeaving!==undefined){
      return {y:given.location>0 ? window.innerHeight : -window.innerHeight,opacity:0,};
    }else{
      return {y:0,opacity:0,}
    }
  },
}

const swipeConfidenceThreshold = 1000;

const swipePower = (offset:number, velocity:number)=>{
  return Math.abs(offset)*velocity;
}

function App() {
  const [index, setIndex] = useState(0);
  const [reverse, setReverse] = useState(0);
  const [location, setLocation] = useState(1);
  const [isLeaving, setIsLeaving] = useState(false);

  const toggleIsLeaving = ()=>setIsLeaving((curr)=>!curr);

  const nextIndex = ()=>{
    if (isLeaving) return;
    setReverse(1);
    setIndex((curr)=>curr+1);
    toggleIsLeaving();
  }

  const prevIndex = ()=>{
    if (isLeaving) return;
    setReverse(-1);
    setIndex((curr)=>curr-1);
    toggleIsLeaving();
  }

  

  return (
    <Container>
      <AnimatePresence 
        initial={false}
        custom={reverse}
        onExitComplete={toggleIsLeaving}
      >
        <InnerContainer
          variants={outerVariants}
          custom={reverse}
          initial="appear"
          animate="center"
          exit="exit"
          key={index}
          transition={{duration: 1}}
        >
          <InnerInnerContainer
            variants={innerVariants}
            initial="up"
            animate="center"
            exit="down"
            key={"inner_"+location}
            transition={{type:"tween", duration:0.7}}
            drag="y"
            dragElastic={2}
            dragConstraints={{top:0, bottom:0}}
            onDragEnd={(e,{offset, velocity})=>{
              const swipe = swipePower(offset.y, velocity.y);
              if (swipe<-swipeConfidenceThreshold){
                if (location===1){
                  setLocation(-1);
                }
              }else if (swipe>swipeConfidenceThreshold) {
                if (location===-1){
                  setLocation(1);
                }
              }
            }}
            custom={{location,isLeaving}}
          >
            {
              location===1 ? <Image 
              src={`https://picsum.photos/1920/1080?random=${index}`}
            /> : <Image 
            src={`https://picsum.photos/1920/1080`}
          />
            }
            
          </InnerInnerContainer>
        </InnerContainer>
        
      </AnimatePresence>
      
      <Button isRight={false} onClick={prevIndex}>
        <MdOutlineArrowBackIos size="24" color="white" style={{width:'100%'}}/>
      </Button>
      <Button isRight={true} onClick={nextIndex}>
        <MdOutlineArrowForwardIos size="24" color="white" style={{width:'100%'}}/>
      </Button>
      <ArrowIndicator
        isBottom={location>0}
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{repeat:Infinity, repeatType:'mirror', duration:1}}
      >
        {location>0 ? <BsChevronDoubleDown size="100" color="white"/> :<BsChevronDoubleUp size="100" color="white"/>}
        
      </ArrowIndicator>
    </Container>
  )
}

export default App
