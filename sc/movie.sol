pragma solidity ^0.4.24;

contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}



contract WatchContract is Ownable {

    struct  Movie {
           uint32   id;               //电影id
           string  name;          // 电影名字
           
    }
    
    struct WatchStat {
           uint32  userNum;     //多少人观看了电影
    }
    
    struct  WatchRecord{
             uint64 begin;
             uint64 end;
    }
    
    event PutWatchRecord(address user, uint64 begin, uint64 end);
    
    Movie private movie;   //保存电影信息
    WatchStat private  watchStat;     //观看电影统计信息
    mapping(address =>  WatchRecord) private watchRecords;  //保存每个用户观看信息
    
    
    constructor(uint32 id,string name,address master) public {
        movie.id = id;
        movie.name = name;
        owner = master;
    }
    
    /*获取电影信息*/
    function getMoiveInfo() public view returns ( uint32 id,string name){
        id = movie.id;
        name = movie.name;
    }
    
    /*上传观看电影记录*/
    function putWatchRecord(address user, uint64 begin, uint64 end) onlyOwner public returns (bool){
        watchRecords[user] = WatchRecord(begin,end);
        emit PutWatchRecord(user,begin,end);
        return true;
    }

    /*获取观看电影信息*/
    function getWatchRecord(address user) public view returns (uint64 begin,uint64 end){
        WatchRecord storage watchRecord = watchRecords[user];
        begin = watchRecord.begin;
        end = watchRecord.end;
    }
    
    /*获取观看电影统计信息*/
    function getWatchStat() public view returns(uint32){
        return watchStat.userNum;
    }

}


/*点赞合约,基于用户点赞或踩信息。*/

contract AdmireContract is Ownable{

    struct  Movie {
           uint32   id;
           string  name;
    }
    
    struct  AdmireStat {
           uint32  userNum;     //多少人点赞、踩了电影
           uint32  upNum;        // 点赞
           uint32  downNum;   // 踩
    }
    
    struct  AdmireRecord{
             bool up;
             bool down;
    }
    
    event PutAdmireRecord(address user,bool  up, bool down);
    Movie movie;   //保存电影信息
    AdmireStat admireStat;   //电影点赞/踩统计信息
    mapping(address =>  AdmireRecord) admireRecords;  //保存每个用户点赞信息


    constructor(uint32 id,string name,address master) public {
        movie.id = id;
        movie.name = name;
        owner = master;
    }
    
    /*获取电影信息*/
    function getMoiveInfo() public view returns ( uint32 id,string name){
        id = movie.id;
        name = movie.name;
    }
    
    /*上传点赞/踩电影记录*/
    function putAdmireRecord(address user,bool  up, bool down) onlyOwner public returns (bool){
        admireRecords[user] = AdmireRecord(up,down);
        emit PutAdmireRecord(user,up,down);
        return true;
    }
    
    /*获取点赞/踩电影信息*/
    function getAdmireRecord(address user) public view returns(bool up,bool down){
        AdmireRecord storage admireRecord = admireRecords[user];
        up = admireRecord.up;
        down = admireRecord.down;
        
    }
    
    /*获取点赞统计信息*/
    function getAdmireStat() public view returns(uint32 userNum,uint32 upNum,uint32 downNum){
        userNum =  admireStat.userNum;
        upNum = admireStat.upNum;
        downNum = admireStat.downNum;
    }

}



contract CommentContract is Ownable{

    struct  Movie {
           uint32  id;
           string  name;
    }
    
    struct ShareData{
           uint8[]  data;
    }
    
    struct  CommentRecord{     //每个评论
             uint64 time;
             uint8[]  data;                  //评论加密内容
             mapping(address=>ShareData) share;    //评论分享
    }
    
    struct UserCommentRecord {
           mapping(uint16=>CommentRecord) record;   //一个人有多个评论
    }
    
    struct  CommentStat {
           uint32  userNum;     //多少人评论了电影
    }
    
    Movie movie;   //保存电影信息
    CommentStat private commentStat;   
    mapping(address =>  UserCommentRecord) commentRecords;  //保存每个用户评论信息
    
    /*具体函数*/
    
    event PutCommentRecord(address user,uint16 id,uint64 time,uint8[] data);
    event ShareCommentRecord(address user,uint16 id,address bAddress,uint8[] data);
    
    constructor(uint32 id,string name,address master) public {
        movie.id = id;
        movie.name = name;
        owner = master;
    }
    
    /*获取电影信息*/
    function getMoiveInfo() public view returns ( uint32 id,string name){
        id = movie.id;
        name = movie.name;
    }
    
    
    /*上传评论记录*/
    function putCommentRecord(address user,uint16 id,uint64 time,uint8[] data) onlyOwner public returns (bool){
        
         UserCommentRecord storage userCommentRecord = commentRecords[user];
         
         userCommentRecord.record[id].time = time;
         userCommentRecord.record[id].data = data;
         emit PutCommentRecord(user,id,time,data);
         return true;
    }
    
    function shareCommentRecord(address user,uint16 id,address bAddress,uint8[] data) onlyOwner public returns (bool){
         UserCommentRecord storage userCommentRecord = commentRecords[user];
         CommentRecord storage commentRecord = userCommentRecord.record[id];
         ShareData storage shareData = commentRecord.share[bAddress]; 
         shareData.data = data;
         emit ShareCommentRecord(user,id,bAddress,data);  
         return true;
    }
    
    
    /*获取评论记录*/
    function getCOmmentRecord(address user,uint16 id) public view returns(uint64 time,uint8[] data){
        UserCommentRecord storage userCommentRecord =  commentRecords[user];
        CommentRecord storage commentRecord = userCommentRecord.record[id];
        time = commentRecord.time;
        data = commentRecord.data;
    }
    
    /*获取评论统计信息*/
    function getCommentStat() public view returns(uint32){
        return commentStat.userNum;
    }
    
    /*获取分享的评论记录*/
    function getShareCommentRecord(address user,uint16 id,address bAddress) public view returns (uint64 time,uint8[] data){
        UserCommentRecord storage userCommentRecord =  commentRecords[user];
        CommentRecord storage commentRecord = userCommentRecord.record[id];
        ShareData storage shareData = commentRecord.share[bAddress];
        data =  shareData.data;
        time = commentRecord.time;
    }
    
}

contract MovieControl is Ownable {
    

    struct  Relation {
             uint32 id;                       //电影id
             string name;                    //电影名字
             bool   issued;
             //uint8  class;
             //address contraceAddress;        //电影合同地址
             address watchAddress;
             address admireAddress;
             address commentAddress;
             
    }
    
    //event IssueContract(string name,uint32 id,bool issued,address contraceAddress);
    event IssueContract(string name,uint32 id,bool issued,address ,address,address);
     
    mapping(uint32=>Relation) relatoins;
    /*具体函数*/
    
    /*  发布点赞合约 */
    function issueContract(string name,uint32 id) onlyOwner public returns (bool){
        require(!relatoins[id].issued,"have issued!");
        /*address contraceAddress;
        // 根据class 创建创建不创建不同的合约
        
        if(class ==1){
         address  contraceAddress  = new WatchContract(id,name,owner);
        }else if(class == 2){
        address    contraceAddress  = new AdmireContract(id,name,owner);
        //}else if(class == 3){
        address    contraceAddress  = new CommentContract(id,name,owner);
        }else{
            return false;
        }
         relatoins[id] = Relation(id,name,true,class,contraceAddress);
          emit IssueContract(name,id,true,contraceAddress);
        */
        
        
        address  watchAddress  = new WatchContract(id,name,owner);
        address    admireAddress  = new AdmireContract(id,name,owner);
        address    commentAddress  = new CommentContract(id,name,owner);
       
        relatoins[id] = Relation(id,name,true,watchAddress,admireAddress,commentAddress);
        
        emit IssueContract(name,id,true,watchAddress,admireAddress,commentAddress);
        return true;
    }
    
    /*获取电影及对应电影子合同
    function getRelation() public view returns (uint32 id, string name, address contraceAddress){
        Relation storage relation = relatoins[id];
        id = relation.id;
        name = relation.name;
        contraceAddress = relation.contraceAddress;
    }*/
    
     function getRelation(uint32 id) public view returns (string name, address watchAddress,
                     address admireAddress,address commentAddress){
        Relation storage relation = relatoins[id];
        id = relation.id;
        name = relation.name;
        watchAddress = relation.watchAddress;
        admireAddress = relation.admireAddress;
        commentAddress = relation.commentAddress;
    }

}


