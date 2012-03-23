<p>alone is a components library based on native JavaScript.</p>
<p>Every component don't need any other dependencies.</p>

<h2>Pop</h2>
<p><a href="http://wondger.github.com/alone/pop/demo.html" target="_blank">demo</a></p>
<pre>
    var mypop = Pop(cfg);
</pre>
<h3>Config Attribute</h3>
<ul>
    <li>type[String] - 'dialog','overlay'(default)</li>
    <li>srcNode[HTMLElement] - </li>
    <li>title[String] - after set type 'dialog'</li>
    <li>url[String] - </li>
    <li>width[number] - Pop width</li>
    <li>height[number] - Pop height</li>
    <li>scroll[String] - 'yes','no'(default)</li>
    <li>trigger[HTMLElment] - Pop trigger</li>
    <li>triggerEvent[String] - Pop trigger event</li>
    <li>maskable[Boolean] - use mask</li>
    <li>closable[Boolean] - use close button</li>
    <li>prefixCls[String] - Pop CSS Class prefix</li>
</ul>
<h3>Method</h3>
<ul>
    <li>render(cfg)</li>
    <li>show(url)</li>
    <li>hide()</li>
    <li>on(event,handler)</li>
    <li>destroy(soft)</li>
</ul>
<h3>Event</h3>
<ul>
    <li>show</li>
    <li>close</li>
</ul>

<h2>Fixed</h2>
<p><a href="http://wondger.github.com/alone/fixed/demo.html" target="_blank">demo</a></p>
<pre>
    var myfixed = Fixed(el[,cfg]).init();
</pre>
<h3>Config Attribute</h3>
<ul>
    <li>el[HTMLElement] - element for fixed</li>
    <li>cfg.width[Number] - el width</li>
    <li>cfg.height[Number] - el height</li>
    <li>cfg.left[Number] - el offset left</li>
    <li>cfg.top[Number] - el offset top</li>
    <li>cfg.bottom[Number] - el offset bottom</li>
    <li>cfg.right[Number] - el offset right</li>
</ul>

<h2>Cookie</h2>
<p>Support SubCookie <a href="http://wondger.github.com/alone/cookie/demo.html" target="_blank">demo</a></p>
<h3>Method</h3>
<ul>
    <li>Cookie.set({name:value[,expires:GMTString,path:'',domain:'',secure:'']}[,main])</li>
    <li>Cookie.set({name1:value1,name2:value2...[,expires:GMTString,path:'',domain:'',secure:'']}[,main])</li>
    <li>Cookie.setSub({name:value[,expires:GMTString,path:'',domain:'',secure:'']},main)</li>
    <li>Cookie.setSub({name1:value1,name2:value2...[,expires:GMTString,path:'',domain:'',secure:'']},main)</li>
    <li>Cookie.get(name[,main])</li>
    <li>Cookie.getSub(name,main)</li>
    <li>Cookie.attr({[expires:'',path:''...]},name)</li>
    <li>Cookie.del(name[,main])</li>
    <li>Cookie.del([name1,name2,name3...][,main])</li>
    <li>Cookie.delSub(name,main)</li>
    <li>Cookie.delSub([name1,name2,name3...],main)</li>
</ul>
