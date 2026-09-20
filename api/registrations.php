<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){http_response_code(204);exit;}
$dbPath=__DIR__.'/data/db.json'; if(!file_exists($dbPath)) file_put_contents($dbPath,json_encode(['registrations'=>[]],JSON_PRETTY_PRINT));
function D(){global $dbPath;$d=json_decode(file_get_contents($dbPath),true);return is_array($d)?$d:[];} function S($d){global $dbPath;file_put_contents($dbPath,json_encode($d,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT),LOCK_EX);} function O($x,$c=200){http_response_code($c);echo json_encode($x,JSON_UNESCAPED_UNICODE);exit;} function B(){ $x=json_decode(file_get_contents('php://input'),true);return is_array($x)?$x:[]; }
$d=D();$p=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);$parts=array_values(array_filter(explode('/',preg_replace('#^/api/registrations/?#','',$p))));$id=$parts[0]??null;$m=$_SERVER['REQUEST_METHOD'];
if($m==='POST'&&!$id){$b=B();foreach(['fullName','contactNumber','emailAddress'] as $k)if(empty($b[$k]))O(['success'=>false,'error'=>'Required field missing: '.$k],422);foreach($d['registrations']??[] as $r)if(($r['contactNumber']??'')===$b['contactNumber']||(($b['emailAddress']??'')&&($r['emailAddress']??'')===$b['emailAddress']))O(['success'=>false,'error'=>'या माहितीद्वारे आधीच नोंदणी झालेली आहे.','existingCandidateId'=>$r['_id']??$r['candidateId']],409);$cid='MP-JOB-2026-'.random_int(100000,999999);$b['_id']=$cid;$b['candidateId']=$cid;$b['id']=$cid;$b['status']='Pending';$b['createdAt']=date('c');$d['registrations'][]=$b;$d['applications'][]=$b;S($d);O(['success'=>true,'candidateId'=>$cid],201);}
if($m==='GET'){if($id){foreach($d['registrations']??[] as $r)if(($r['_id']??$r['id']??'')===$id)O(['success'=>true,'registration'=>$r]);O(['success'=>false,'error'=>'Not found'],404);}O(['success'=>true,'registrations'=>$d['registrations']??[]]);}
if($id&&$m==='PUT'){ $b=B(); foreach($d['registrations']??[] as $i=>$r)if(($r['_id']??$r['id']??'')===$id){$b['_id']=$id;$b['id']=$id;$b['candidateId']=$r['candidateId']??$id;$b['createdAt']=$r['createdAt']??date('c');$d['registrations'][$i]=array_merge($r,$b); foreach($d['applications']??[] as $j=>$a)if(($a['id']??'')===$id)$d['applications'][$j]=$d['registrations'][$i];S($d);O(['success'=>true,'registration'=>$d['registrations'][$i]]);}O(['success'=>false,'error'=>'Not found'],404); }
if($id&&$m==='DELETE'){foreach($d['registrations']??[] as $i=>$r)if(($r['_id']??$r['id']??'')===$id){array_splice($d['registrations'],$i,1);foreach($d['applications']??[] as $j=>$a)if(($a['id']??'')===$id)array_splice($d['applications'],$j,1);S($d);O(['success'=>true]);}O(['success'=>false,'error'=>'Not found'],404);}
O(['success'=>false,'error'=>'Endpoint not found'],404);
?>
